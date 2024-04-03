const Joi = require("joi");

const daanSchema = Joi.object({
    daan: Joi.object({
        _id: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
        __v: Joi.number(),
        name: Joi.string().required().error(new Error('Name is required')),
        gaam: Joi.string().required().error(new Error('Gaam is required')),
        taluko: Joi.string().required().error(new Error('Taluko is required')),
        seva: Joi.string().required().error(new Error('Seva is required')),
        mobileNumber: Joi.number().integer().required().min(1000000000).max(9999999999)
            .error(new Error('Mobile number must be a 10-digit number')),
        paymentMethod: Joi.string().valid("cash", "bank", "upi").required().error(new Error('Invalid payment method')),
        amount: Joi.number().required().error(new Error('Amount is required')),
    }).required().options({ abortEarly: false })
});

module.exports = {daanSchema}