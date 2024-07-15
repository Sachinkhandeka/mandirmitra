const Asset = require("../models/assetsSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createAsset = async(req ,res)=> {
    const templeId = req.params.templeId;
    const assetData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple ID is required.");
    }

    if(!assetData) {
        throw new ExpressError(404, "Plese provide valid data.");
    }

    const newAsset = new Asset({
        ...assetData,
        templeId : templeId,
    });

    await newAsset.save();

    res.status(200).json({ message : "Asset added successfully" });
}