// Import necessary modules
const ReviewProduct = require('../../models/ReviewProduct');

// Edit a review
const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId  = req.userId; 
        const { rating, comment } = req.body;

        // Find the review
        const review = await ReviewProduct.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the author
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to edit this review' });
        }

        // Update the review
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        // Save the updated review
        await review.save();

        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = editReview;