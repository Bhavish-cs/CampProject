// Middleware to check if user is logged in
export const isLoggedIn = (req, res, next) => {
    // Check for both session user (email auth) and passport user (Google OAuth)
    if (!req.session.user_id && !req.user) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

// Middleware to check if user is the author of the campground
export const isAuthor = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Import Campground model
        const { default: Campground } = await import('../models/campground.js');

        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }

        // Get current user ID from either session or passport
        const currentUserId = req.session.user_id || (req.user ? req.user._id : null);
        if (!currentUserId) {
            req.flash('error', 'You must be signed in first!');
            return res.redirect('/login');
        }

        if (!campground.author.equals(currentUserId)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }

        next();
    } catch (error) {
        req.flash('error', 'Something went wrong!');
        return res.redirect('/campgrounds');
    }
};

// Middleware to check if user is the author of the review
export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    try {
        // Import Review model
        const { default: Review } = await import('../models/review.js');

        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash('error', 'Cannot find that review!');
            return res.redirect(`/campgrounds/${id}`);
        }

        // Get current user ID from either session or passport
        const currentUserId = req.session.user_id || (req.user ? req.user._id : null);
        if (!currentUserId) {
            req.flash('error', 'You must be signed in first!');
            return res.redirect('/login');
        }

        if (!review.author.equals(currentUserId)) {
            req.flash('error', 'You do not have permission to delete this review!');
            return res.redirect(`/campgrounds/${id}`);
        }

        next();
    } catch (error) {
        req.flash('error', 'Something went wrong!');
        return res.redirect(`/campgrounds/${id}`);
    }
};
