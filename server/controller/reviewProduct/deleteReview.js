// Import necessary modules
const ReviewProduct = require('../../models/ReviewProduct');
const Product = require('../../models/ProductModel');

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId, productId } = req.params;
        const  userId = req.userId
        const  userRole = req.userRole; 

        // Find the review
        const review = await ReviewProduct.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the author or an admin
        if (review.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this review' });
        }

        // Delete the review
        await review.remove();

        // Optionally, update the product's review list
        const product = await Product.findById(productId);
        if (product) {
            product.reviews = product.reviews.filter(id => id.toString() !== reviewId);
            await product.save();
        }

        res.status(200).json({ message: 'Review and its replies deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = deleteReview;