const ExpressError = require("../utils/ExpressError");
const Temple  = require("../models/temple");
const SuperAdmin = require("../models/superAdmin");
const bcryptjs = require("bcryptjs");
const salt = bcryptjs.genSaltSync(10);

module.exports.createController = async(req ,res)=> {
    const { templeId, username , email , password } = req.body ; 

    // Check if temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    // Create super admin
    let superAdmin = new SuperAdmin({
        username,
        email,
        password :  bcryptjs.hashSync(password, salt),
    });

    // Save super admin
    superAdmin  = await superAdmin.save();

    // Update temple with super admin's ID
    temple.superAdmin = superAdmin._id;
    await temple.save();

    const { password : pass, ...rest } = superAdmin._doc;

    res.status(200).json({
        user : rest,
        templeId : temple._id,
    });
}