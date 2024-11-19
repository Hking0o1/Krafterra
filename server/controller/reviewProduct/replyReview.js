
const ReviewProduct = require('../../models/ReviewProduct');

const addReply = async (req, res) => {
    try {
        const { reviewId, userId, comment } = req.body;

        // Find the review by ID
        const review = await ReviewProduct.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Add the reply to the review
        review.replies.push({
            user: userId,
            comment
        });

        // Save the updated review
        await review.save();

        res.status(201).json({ message: 'Reply added successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = addReply;