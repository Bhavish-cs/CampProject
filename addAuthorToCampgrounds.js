// Migration script to add author field to existing campgrounds
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import User from './models/user.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const addAuthorToCampgrounds = async () => {
    try {
        console.log('🔍 Checking campgrounds without authors...');
        
        // Find all campgrounds without an author
        const campgroundsWithoutAuthor = await Campground.find({ 
            $or: [
                { author: { $exists: false } },
                { author: null }
            ]
        });
        
        console.log(`Found ${campgroundsWithoutAuthor.length} campgrounds without authors`);
        
        // Get the first user to assign as default author
        const firstUser = await User.findOne({});
        
        if (!firstUser) {
            console.log('❌ No users found in database. Please register a user first.');
            return;
        }
        
        console.log(`📝 Assigning all campgrounds to user: ${firstUser.username}`);
        
        // Update all campgrounds without authors
        const result = await Campground.updateMany(
            { 
                $or: [
                    { author: { $exists: false } },
                    { author: null }
                ]
            },
            { 
                $set: { author: firstUser._id }
            }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} campgrounds`);
        console.log('🎉 Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

addAuthorToCampgrounds();
