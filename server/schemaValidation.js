const Joi = require("joi");

//donation schema validation 
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

//permissions schema validation 
const permissionSchema = Joi.object({
    permissionName: Joi.string().valid(
        'donation-creator',
        'donation-viewer',
        'donation-editor',
        'donation-deleter',
        'donation-contributor',
        'donation-manager',
        'donation-supervisor'
    ).required().error(new Error('Invalid permission name')),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    actions: Joi.array().items(Joi.string().valid('create', 'read', 'update', 'delete')).required().error(new Error('Invalid actions')),
}).required().options({ abortEarly: false });

//role schema validations
const roleSchema = Joi.object({
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    name: Joi.string().required().error(new Error('Role name is required')),
    permissions: Joi.array().required().error(new Error('Invalid permissions')),
}).required().options({ abortEarly: false });

//superAdmin schema validations
const superAdminSchema = Joi.object({
    username: Joi.string().required().error(new Error('Username is required')),
    email: Joi.string().email().required().error(new Error('Invalid email')),
    password: Joi.string().required().error(new Error('Password is required')),
    isAdmin: Joi.boolean().default(true),
    profilePicture: Joi.string().default('https://www.clipartmax.com/png/middle/82-820644_author-image-admin-icon.png'),
    templeId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('Invalid temple ID')),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{8,}$/).required().error(new Error('Invalid phone number')),
}).required().options({ abortEarly: false });

//temple schema validations
const templeSchema = Joi.object({
    name: Joi.string().required().error(new Error('Temple name is required')),
    location: Joi.string().required().error(new Error('Location is required')),
    image: Joi.string().default('https://png.pngtree.com/png-vector/20230207/ourmid/pngtree-om-logo-design-with-flower-mandala-png-image_6590267.png')
}).required().options({ abortEarly: false });

//user schema validations
const userSchema = Joi.object({
    username: Joi.string().required().error(new Error('Username is required')),
    email: Joi.string().email().required().error(new Error('Valid email is required')),
    password: Joi.string().required().error(new Error('Password is required')),
    profilePicture: Joi.string().default('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNChij9NGxfXhZQeEwg0TG9WAK6vm4vVm-e0EncJcCQ&s'),
    isAdmin: Joi.boolean().default(false),
    templeId: Joi.string().required().error(new Error('Temple ID is required')),
    phoneNumber: Joi.string().pattern(/^\+\d{1,3}\d{8,}$/).required().error(new Error('Invalid phone number')),
    roles: Joi.array().items().error(new Error('Roles must be an array of strings'))
}).required().options({ abortEarly: false });

//expense schema validations
const expenseSchema = Joi.object({
    title: Joi.string().required().error(new Error('Title is required')),
    description: Joi.string().required().error(new Error('Description is required')),
    amount: Joi.number().required().error(new Error('Amount is required')),
    date: Joi.date().default(Date.now),
    category: Joi.string().required().error(new Error('Category is required')),
    status: Joi.string().valid('pending', 'approved', 'completed', 'rejected').default('pending'),
    templeId: Joi.string().required().error(new Error('Temple ID is required'))
}).options({ abortEarly: false });

//event shcema validations
const eventSchema = Joi.object({
    name : Joi.string().required().error(new Error('Name is required')),
    date : Joi.date().default(Date.now),
    location : Joi.string().required().error(new Error("Location is required")),
    status : Joi.string().valid('pending', 'completed').default('pending'),
    templeId : Joi.string().required().error(new Error('Temple ID is required'))
}).options({ abortEarly : false });

// Invitation validation schema
const invitationSchema = Joi.object({
    donorName: Joi.string().required().error(new Error('Donor Name is required')),
    passCode: Joi.string().required().error(new Error('PassCode is required')),
    invited: Joi.boolean().default(false),
    attended: Joi.boolean().default(false),
    temple: Joi.string().required().error(new Error('Temple ID is required')),
    event: Joi.string().required().error(new Error('Event ID is required'))
}).options({ abortEarly: false });

module.exports = {
    daanSchema,
    permissionSchema,
    roleSchema,
    superAdminSchema,
    templeSchema,
    userSchema,
    expenseSchema,
    eventSchema,
    invitationSchema,
}