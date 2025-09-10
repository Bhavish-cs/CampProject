import mongoose from 'mongoose';
import Campground from './models/campground.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected for Cleanup"))
    .catch(err => console.log("Connection error:", err));

async function cleanupOldImageField() {
    try {
        console.log('Starting cleanup of old image field...');

        // Find all campgrounds that have images array populated
        const campgrounds = await Campground.find({
            images: { $exists: true, $ne: [], $ne: null }
        });

        console.log(`Found ${campgrounds.length} campgrounds with new images format`);

        for (let campground of campgrounds) {
            if (campground.image && campground.images.length > 0) {
                // Remove the old image field if images array exists
                campground.image = undefined;
                console.log(`Cleaning up campground: ${campground.title}`);
                await campground.save();
            }
        }

        console.log('Cleanup completed successfully!');

    } catch (error) {
        console.error('Cleanup failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

cleanupOldImageField();
