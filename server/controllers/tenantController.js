const Tenant = require("../models/tenantSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createTenant = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const tenantData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple Id is required.");
    }

    if(!tenantData) {
        throw new ExpressError(404, "Please provide valid tenant data.");
    }

    const newTenant = new Tenant({
        ...tenantData,
        templeId : templeId
    });

    await newTenant.save();

    res.status(200).json({ message : "Tenant added successfully." });
}