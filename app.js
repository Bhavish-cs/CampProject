import express from 'express';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import methodOverride from 'method-override';
import multer from 'multer';
import catchAsync from './utils/catchAsync.js';
import ExpressError from './utils/ExpressError.js';

// Fix __dirname and __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log("Database Connected"))
    .catch(err => console.log("Connection error:", err));

const app = express();

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/uploads', express.static('uploads'));

// Home Route
app.get('/', (req, res) => {
    res.send('HELLO FROM CAMP!');
});

// Create campground
app.post('/campgrounds', upload.single('image'), catchAsync(async (req, res) => {
    const campgroundData = req.body.campground;

    if (isNaN(Number(campgroundData.price)) || campgroundData.price === '') {
        throw new ExpressError('Price must be a number', 400);
    }

    if (req.file) {
        campgroundData.image = `/uploads/${req.file.filename}`;
    }

    const newCampground = new Campground(campgroundData);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// List campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// New campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});




app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).render('error', {
            err: { message: 'Campground not found', statusCode: 404 }
        });
    }

    // Fetch campground from DB
    const campground = await Campground.findById(id);

    // If not found, send 404
    if (!campground) {
        return res.status(404).render('error', {
            err: { message: 'Campground not found', statusCode: 404 }
        });
    }

    // Your timeAgo function
    function timeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const days = Math.floor(seconds / 86400);
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        const hours = Math.floor(seconds / 3600);
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'just now';
    }

    // Render the show page
    res.render('campgrounds/show', { campground, timeAgo });
}));



// Edit campground
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

// Update campground

app.put('/campgrounds/:id', upload.single('image'), catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (isNaN(Number(req.body.campground.price)) || req.body.campground.price === '') {
        throw new ExpressError('Price must be a number', 400);
    }

    campground.title = req.body.campground.title;
    campground.location = req.body.campground.location;
    campground.price = req.body.campground.price;
    campground.description = req.body.campground.description;

    if (req.file) {
        campground.image = `/uploads/${req.file.filename}`;
    }

    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));



// Delete campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err.message || 'Oh boy something is wrong');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong';
    res.status(statusCode).render('error', { err });
});


// Start server
app.listen(3000, () => {
    console.log('Serving on port 3000');
});
