import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    // Keep the old image field for backward compatibility during migration
    image: String,
    price: Number, // Changed to Number for price
    description: String,
    location: String,
    // Add coordinate fields for mapping
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    // GeoJSON geometry for spatial queries (optional, for advanced features)
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
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

// Virtual to provide fallback image for backward compatibility
campgroundSchema.virtual('primaryImage').get(function () {
    if (this.images && this.images.length > 0) {
        return this.images[0].url;
    }
    return this.image || '/uploads/placeholder.jpg';
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
