// isLoggedIn middleware - checks if user is authenticated
export const isLoggedIn = (req, res, next) => {
    if (!req.session.user_id && !req.user) {
        req.flash('error', 'You must be signed in to do that!');
        return res.redirect('/login');
    }
    next();
};

// isAuthor middleware - checks if user is the author of the campground
export const isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { default: Campground } = await import('../models/campground.js');
        
        const campground = await Campground.findById(id).populate('author');
        
        if (!campground) {
            req.flash('error', 'Campground not found!');
            return res.redirect('/campgrounds');
        }
        
        // Get current user ID from session or passport
        const currentUserId = req.session.user_id || req.user?._id;
        
        if (!currentUserId || !campground.author || campground.author._id.toString() !== currentUserId.toString()) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/campgrounds/${id}`);
        }
        
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        req.flash('error', 'Something went wrong!');
        res.redirect('/campgrounds');
    }
};

// getUserId helper function
export const getUserId = (req) => {
    return req.session.user_id || req.user?._id;
};
