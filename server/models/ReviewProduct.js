const mongoose = require('mongoose');

const reviewProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  verified_purchase: {
    type: Boolean,
    default: false
  },
  helpful_votes: {
    type: Number,
    default: 0
  },
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
reviewProductSchema.index({ product: 1, user: 1 });
reviewProductSchema.index({ product: 1, createdAt: -1 });

// Static method to calculate average rating for a product
reviewProductSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { averageRating: 0, numberOfReviews: 0 };
};

const ReviewProduct = mongoose.model('ReviewProduct', reviewProductSchema);

module.exports = ReviewProduct;
