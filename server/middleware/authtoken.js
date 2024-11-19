const jwt = require('jsonwebtoken');

/**
 * Authenticates a request by verifying the JWT token.
 *
 * @param {object} req - The incoming request object.
 * @param {object} res - The outgoing response object.
 * @param {function} next - The next middleware function in the stack.
 */
async function authToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1]; // Get token from cookie or header
    if (!token) {
        return res.status(401).json({ message: 'No token provided', error: true });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        if (!decoded.user || !decoded.user.id) {
            return res.status(401).json({ message: 'User ID not found in token', error: true });
        }
        req.userId = decoded?.user.id;
        req.userRole = decoded?.user.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: error , error: true });
    }
}

module.exports = authToken;