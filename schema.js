import Joi from "joi";

export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required(),
});

// export const reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         comment: Joi.string().required(),
//     }).required(),
// });

// export const reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().min(1).max(5).required(),
//         comment: Joi.string().required(),
//     }).required(),
// });


export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .integer()           // Important: ratings are whole numbers
            .min(1)
            .max(5)
            .required()
            .messages({
                'number.base': 'Rating must be a number between 1 and 5',
                'number.min': 'Rating must be at least 1 star',
                'number.max': 'Rating must be at most 5 stars',
                'any.required': 'Please select a rating'
            }),
        comment: Joi.string()
            .trim()
            .min(5)              // Optional: prevent very short comments
            .required()
            .messages({
                'string.empty': 'Please add some comments for the review',
                'string.min': 'Comment should be at least 5 characters long'
            }),
    }).required(),
});