import mongoose from 'mongoose';
import Campground from '../models/campground.js';
// Import cities data (make sure you have this file)
import cities from './cities.js';

console.log("Starting seed script...");

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * cities.length);
        const camp = new Campground({
            title: `Campground ${i + 1}`,
            price: Math.floor(Math.random() * 50) + 10,
            description: 'Seeded campground',
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });
        await camp.save();
        console.log("Seeded:", camp);
    }
};

seedDB().then(() => mongoose.connection.close());
