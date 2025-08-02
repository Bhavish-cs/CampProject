import mongoose from 'mongoose';
import Campground from '../models/campground.js';
import { places, descriptors } from './seedHelpers.js';
import cities from './cities.js';


mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const sample = array => array[Math.floor(Math.random() * array.length)];

const getImageFromUnsplash = async () => {
    try {
        const res = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                query: 'camping', // You can change this to "mountain", "forest", etc.
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        return res.data.urls.regular;
    } catch (err) {
        console.error("Error fetching from Unsplash:", err.message);
        // fallback image
        return 'https://source.unsplash.com/collection/483251/1600x900';
    }
};


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * cities.length);
        const imgUrl = await getImageFromUnsplash();


        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 50) + 10,
            image: imgUrl,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        });

        await camp.save();
        console.log("Seeded:", camp.title);
    }
};

seedDB().then(() => mongoose.connection.close());
