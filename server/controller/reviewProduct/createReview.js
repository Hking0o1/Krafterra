// Import necessary modules
const ReviewProduct = require('../../models/ReviewProduct');
const Product = require('../../models/ProductModel');

// Create a new review
const createReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create a new review
        const review = new ReviewProduct({
            product: productId,
            user: userId,
            rating,
            comment,
            replies: []
        });

        await review.save();

        product.reviews.push(review._id);
        await product.save();

        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = createReview;
