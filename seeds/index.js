import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Campground from '../models/campground.js';

dotenv.config();

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log(" Connected"))
    .catch(err => console.log(" Connection error:", err));

const getImageFromPexels = async () => {
    try {
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const res = await axios.get('https://api.pexels.com/v1/search', {
            params: {
                query: 'camping',
                per_page: 1,
                page: randomPage
            },
            headers: {
                Authorization: process.env.PEXELS_API_KEY
            }
        });

        const photos = res.data.photos;
        return photos.length > 0
            ? photos[0].src.landscape
            : 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg';

    } catch (err) {
        console.error("Pexels API Error:", err.message);
        return 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg';
    }
};

const updateImages = async () => {
    const campgrounds = await Campground.find({});
    for (let camp of campgrounds) {
        const newImage = await getImageFromPexels();
        camp.image = newImage;
        await camp.save();
        console.log(`🖼️ Updated: ${camp.title}`);
    }

    mongoose.connection.close();
};

updateImages();
