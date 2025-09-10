// validateCampground.js
import Joi from 'joi';
import ExpressError from '../utils/ExpressError.js';

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

export default function validateCampground(req, res, next) {
    // For new campgrounds, require at least one image upload
    const isNewCampground = req.method === 'POST' && req.url === '/campgrounds';
    if (isNewCampground && (!req.files || req.files.length === 0) && !req.file) {
        req.flash('error', 'At least one image is required');
        return res.redirect('/campgrounds/new');
    }

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        req.flash('error', msg);
        return res.redirect(isNewCampground ? '/campgrounds/new' : 'back');
    }

    // Additional price check
    const price = req.body.campground.price;
    if (isNaN(Number(price)) || price === '') {
        req.flash('error', 'Price must be a valid number');
        return res.redirect(isNewCampground ? '/campgrounds/new' : 'back');
    }

    next();
}
