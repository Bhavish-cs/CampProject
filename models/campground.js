import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number, // Changed to Number for price
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to delete all reviews when a campground is deleted
campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // Import Review model dynamically to avoid circular imports
        const { default: Review } = await import('./review.js');
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

export default mongoose.model('Campground', campgroundSchema);
