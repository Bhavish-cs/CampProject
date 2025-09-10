import mongoose from 'mongoose';
import Campground from './models/campground.js';
import User from './models/user.js';

// Database connection
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log('MongoDB connected for migration'))
    .catch(err => console.error('MongoDB connection error:', err));

const assignAuthorsToExistingCampgrounds = async () => {
    try {
        console.log('Starting migration: Assigning authors to existing campgrounds...');
        
        // Find campgrounds without authors
        const campgroundsWithoutAuthors = await Campground.find({ author: { $exists: false } });
        
        if (campgroundsWithoutAuthors.length === 0) {
            console.log('✅ All campgrounds already have authors assigned.');
            return;
        }
        
        console.log(`Found ${campgroundsWithoutAuthors.length} campgrounds without authors.`);
        
        // Get the first user from the database (or create one if none exists)
        let defaultUser = await User.findOne();
        
        if (!defaultUser) {
            console.log('No users found. Creating a default user...');
            defaultUser = new User({
                email: 'admin@example.com',
                username: 'admin'
            });
            await defaultUser.save();
            console.log('✅ Default user created.');
        }
        
        console.log(`Using user "${defaultUser.username}" (${defaultUser.email}) as default author.`);
        
        // Update all campgrounds without authors
        const updateResult = await Campground.updateMany(
            { author: { $exists: false } },
            { $set: { author: defaultUser._id } }
        );
        
        console.log(`✅ Migration completed! Updated ${updateResult.modifiedCount} campgrounds.`);
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
};

// Run the migration
assignAuthorsToExistingCampgrounds();
