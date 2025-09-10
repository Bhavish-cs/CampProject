import mongoose from 'mongoose';
import Campground from './models/campground.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected for Migration"))
    .catch(err => console.log("Connection error:", err));

async function migrateImages() {
    try {
        console.log('Starting comprehensive image migration...');

        // Find all campgrounds
        const campgrounds = await Campground.find({});
        console.log(`Found ${campgrounds.length} campgrounds to check`);

        let migratedCount = 0;

        for (let campground of campgrounds) {
            let needsUpdate = false;

            // Case 1: Has old image field but no images array
            if (campground.image && (!campground.images || campground.images.length === 0)) {
                campground.images = [{
                    url: campground.image,
                    filename: campground.image.split('/').pop()
                }];
                needsUpdate = true;
                console.log(`Migrated campground: ${campground.title} (old image to images array)`);
            }

            // Case 2: Has images array but still has old image field - clean it up
            if (campground.image && campground.images && campground.images.length > 0) {
                campground.image = undefined;
                needsUpdate = true;
                console.log(`Cleaned up old image field for: ${campground.title}`);
            }

            if (needsUpdate) {
                await campground.save();
                migratedCount++;
            }
        }

        console.log(`Migration completed! ${migratedCount} campgrounds updated.`);

        // Show final state
        const finalState = await Campground.find({}, 'title image images');
        finalState.forEach(camp => {
            console.log(`${camp.title}: images=${camp.images?.length || 0}, oldImage=${camp.image ? 'yes' : 'no'}`);
        });

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

migrateImages();
