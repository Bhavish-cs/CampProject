import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Campground from '../models/campground.js';
import cities from './cities.js';
import { descriptors, places } from './seedHelpers.js';

dotenv.config();

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("🗄️ Database Connected"))
    .catch(err => console.log("❌ Connection error:", err));

// Function to get random element from array
const sample = array => array[Math.floor(Math.random() * array.length)];

// Function to get random price between 20-30
const randomPrice = () => Math.floor(Math.random() * 20) + 10;

// Function to get unique camping images from Pexels
const getImageFromPexels = async () => {
    try {
        const randomPage = Math.floor(Math.random() * 100) + 1;
        const queries = ['camping', 'campground', 'tent', 'wilderness', 'outdoor', 'nature', 'forest camp'];
        const randomQuery = sample(queries);

        const res = await axios.get('https://api.pexels.com/v1/search', {
            params: {
                query: randomQuery,
                per_page: 1,
                page: randomPage
            },
            headers: {
                Authorization: process.env.PEXELS_API_KEY
            }
        });

        const photos = res.data.photos;
        if (photos.length > 0) {
            return {
                url: photos[0].src.landscape,
                filename: `pexels-${photos[0].id}`
            };
        } else {
            // Fallback to default camping images
            const fallbackImages = [
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3',
                'https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?ixlib=rb-4.0.3'
            ];
            return {
                url: sample(fallbackImages),
                filename: 'fallback-camping'
            };
        }

    } catch (err) {
        console.error("Pexels API Error:", err.message);
        return {
            url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3',
            filename: 'default-camping'
        };
    }
};

// Sample campground descriptions
const descriptions = [
    "Escape to nature's embrace at this serene campground, where towering trees provide shade and wildlife roams freely.",
    "Experience the perfect blend of adventure and tranquility at this stunning outdoor retreat.",
    "Discover your own slice of paradise with breathtaking views and endless recreational opportunities.",
    "Immerse yourself in the great outdoors where memories are made and nature beckons.",
    "Find peace and adventure in equal measure at this beautiful natural sanctuary.",
    "Wake up to stunning sunrises and fall asleep under a canopy of stars at this magical location.",
    "Adventure awaits at this pristine campground, perfect for families and outdoor enthusiasts alike.",
    "Connect with nature and disconnect from the digital world at this peaceful outdoor haven."
];

const seedDB = async () => {
    try {
        // Clear existing campgrounds
        await Campground.deleteMany({});
        console.log("🗑️ Cleared existing campgrounds");

        // Create new campgrounds with coordinates and unique images
        for (let i = 0; i < 50; i++) {
            console.log(`📸 Creating campground ${i + 1}/50...`);

            // Get random city with coordinates
            const randomCityIndex = Math.floor(Math.random() * cities.length);
            const city = cities[randomCityIndex];

            // Skip cities without coordinates
            if (!city.latitude || !city.longitude) {
                i--; // Retry this iteration
                continue;
            }

            // Create campground name
            const campgroundName = `${sample(descriptors)} ${sample(places)}`;

            // Get unique images for this campground
            const image1 = await getImageFromPexels();
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to avoid rate limiting
            const image2 = await getImageFromPexels();

            // Create new campground with coordinates
            const camp = new Campground({
                title: campgroundName,
                location: `${city.city}, ${city.state}`,
                description: sample(descriptions),
                price: randomPrice(),
                // Add geographic coordinates
                geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(city.longitude), parseFloat(city.latitude)] // [lng, lat] for GeoJSON
                },
                latitude: parseFloat(city.latitude),
                longitude: parseFloat(city.longitude),
                // Add unique images from Pexels
                images: [image1, image2]
            });

            await camp.save();
            console.log(`🏕️ Created: ${campgroundName} in ${city.city}, ${city.state}`);
        }

        console.log("✅ Successfully seeded campgrounds with coordinates and unique images!");

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDB();