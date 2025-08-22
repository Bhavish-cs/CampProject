
import express from 'express';
import path, { dirname } from 'path';
import mongoose from 'mongoose';
import Campground from './models/campground.js';
import Review from './models/review.js';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import Joi from 'joi';
import methodOverride from 'method-override';
import multer from 'multer';
import catchAsync from './utils/catchAsync.js';
import ExpressError from './utils/ExpressError.js';
import validateCampground from './middlewares/validateCampground.js';
import { title } from 'process';
import session from 'express-session';
import flash from 'connect-flash';

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

// Session configuration
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Middleware
app.use(session(sessionConfig));
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.info = req.flash('info');
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.send('HELLO FROM CAMP!');
});

// Create campground
app.post('/campgrounds', upload.single('image'), validateCampground, catchAsync(async (req, res) => {
    const campgroundData = req.body.campground;
    const newCampground = new Campground(campgroundData);
    await newCampground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));


// List campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// New campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});




app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    // Fetch campground from DB and populate reviews
    const campground = await Campground.findById(id).populate('reviews');

    // If not found, send 404
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
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
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError('Campground not found', 404);
    }

    const campground = await Campground.findById(id);

    // If not found, throw error
    if (!campground) {
        throw new ExpressError('Campground not found', 404);
    }

    res.render('campgrounds/edit', { campground });
}));

// Update campground

app.put('/campgrounds/:id', upload.single('image'), validateCampground, catchAsync(async (req, res) => {
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
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));



// Delete campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError('Campground not found', 404);
    }

    const campground = await Campground.findByIdAndDelete(id);

    // If not found, throw error
    if (!campground) {
        throw new ExpressError('Campground not found', 404);
    }

    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

// POST route to handle review submission
app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError('Campground not found', 404);
    }

    const campground = await Campground.findById(id);
    if (!campground) {
        throw new ExpressError('Campground not found', 404);
    }

    const { body, rating } = req.body.review;

    // Validate review body (not empty or just whitespace)
    if (!body || body.trim().length === 0) {
        throw new ExpressError('Review text cannot be empty', 400);
    }

    // Validate rating exists and is within range
    if (!rating || rating < 1 || rating > 5) {
        throw new ExpressError('Rating must be between 1 and 5 stars', 400);
    }

    // Validate review length (optional - prevent spam)
    if (body.trim().length < 5) {
        throw new ExpressError('Review must be at least 5 characters long', 400);
    }

    if (body.trim().length > 500) {
        throw new ExpressError('Review cannot exceed 500 characters', 400);
    }

    const review = new Review({
        body: body.trim(),
        rating: parseInt(rating),
        campground: id
    });

    await review.save();
    campground.reviews.push(review._id);
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${id}`);
}));

// DELETE route to handle review deletion
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Check if both IDs are valid Mongo ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new ExpressError('Campground or Review not found', 404);
    }

    // Find the campground and remove the review from its reviews array
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    if (!campground) {
        throw new ExpressError('Campground not found', 404);
    }

    // Delete the review from the Review collection
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
        throw new ExpressError('Review not found', 404);
    }

    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

// Error handler

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
