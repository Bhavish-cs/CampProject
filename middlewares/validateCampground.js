// validateCampground.js
import Joi from 'joi';
import ExpressError from '../utils/ExpressError.js';

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

export default function validateCampground(req, res, next) {
    // Attach uploaded file path to req.body.campground.image if present
    if (req.file) {
        if (!req.body.campground) req.body.campground = {};
        req.body.campground.image = `/uploads/${req.file.filename}`;
    }

    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    }

    // Additional price check (optional if you trust Joi's number validation)
    const price = req.body.campground.price;
    if (isNaN(Number(price)) || price === '') {
        return next(new ExpressError('Price must be a number', 400));
    }

    next();
}
