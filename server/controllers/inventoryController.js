const InventoryItem = require("../models/inventorySchema");
const ExpressError = require("../utils/ExpressError");

module.exports.create = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const inventoryData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "TempleId not found");
    }

    if(!inventoryData) {
        throw new ExpressError(404, "Please provide valid inventory data.");
    }
    const inventoryItem = new InventoryItem({...inventoryData, templeId : templeId});

    await inventoryItem.save();

    res.status(200).json({ message : "Inventory created successfully" });
}

module.exports.AllInventories = async(req ,res)=> {
    const { templeId } = req.params ; 

    if(!templeId) {
        throw new ExpressError(400, "TempleId required.");
    }

    const inventoryItems = await InventoryItem.find({templeId : templeId});

    res.status(200).json({
        inventoryItems,
    });
}