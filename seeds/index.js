import mongoose from 'mongoose';
import Campground from '../models/campground.js';
import { places, descriptors } from './seedHelpers.js';
import cities from './cities.js';


mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const sample = array => array[Math.floor(Math.random() * array.length)];

// Generate random campground images using Picsum
const getRandomCampgroundImage = () => {
    const imageId = Math.floor(Math.random() * 1000) + 1;
    return `https://picsum.photos/800/600?random=${imageId}`;
};

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * cities.length);
        const imgUrl = getRandomCampgroundImage();

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
