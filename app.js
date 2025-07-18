import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home Route
app.get('/', (req, res) => {
    res.send('HELLO FROM CAMP!');
});

// Route to create a new campground
app.get('/makecampground', async (req, res) => {
    try {
        const camp = new Campground({
            title: 'My Backyard',
            price: 10,
            description: 'Cheap camping!',
            location: 'My City'
        });
        await camp.save();
        res.send(camp);
    } catch (err) {
        res.status(500).send('Error creating campground');
    }
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});