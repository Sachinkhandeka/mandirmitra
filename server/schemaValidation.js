const Joi = require("joi");

const daanSchema = Joi.object({
    donation: Joi.object({
        _id: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        __v: Joi.number(),
        donorName: Joi.string().required().error(new Error('Donor name is required')),
        sevaName: Joi.string().required().error(new Error('Seva name is required')),
        country: Joi.string().required().error(new Error('Country is required')),
        state: Joi.string().required().error(new Error('State is required')),
        district: Joi.string().required().error(new Error('District is required')),
        tehsil: Joi.string().required().error(new Error('Tehsil is required')),
        village: Joi.string().required().error(new Error('Village is required')),
        contactInfo: Joi.number().integer().required().min(1000000000).max(9999999999)
            .error(new Error('Contact info must be a 10-digit number')),
        paymentMethod: Joi.string().valid("cash", "bank", "upi").required().error(new Error('Invalid payment method')),
        donationAmount: Joi.number().required().error(new Error('Donation amount is required')),
    }).required().options({ abortEarly: false })
});

module.exports = {daanSchema}