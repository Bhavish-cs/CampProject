import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import { dirname } from 'path';
import methodOverride from 'method-override';



// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use MongoDB Atlas connection string
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// Connect to MongoDB
mongoose.connect(dbUrl)
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Home Route
app.get('/', (req, res) => {
    res.send('HELLO FROM CAMP!');
});

app.post('/campgrounds', async (req, res) => {
    // Access form data using req.body
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`); // Redirect to the newly created campground's show page
});


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});



app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});


app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');

})

app.listen(3001, () => {
    console.log('Serving on port 3000');
<<<<<<< HEAD
});
=======
});
>>>>>>> 8fa26b1 ( still the normal changes)
