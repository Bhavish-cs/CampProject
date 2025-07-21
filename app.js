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

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});



app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})
// Route to create a new campground

app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});


app.listen(3000, () => {
    console.log('Serving on port 3000');
}); 