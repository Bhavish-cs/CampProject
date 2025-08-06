import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number, // Changed to Number for price
    description: String,
    location: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Campground', campgroundSchema);
