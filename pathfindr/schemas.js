const Joi = require('joi');
const { number } = require('joi');

module.exports.schoolSchema = Joi.object({
    school: Joi.object({
        schoolName: Joi.string().required(),
        fees: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})

