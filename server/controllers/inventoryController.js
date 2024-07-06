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
    const totalInventories = await InventoryItem.countDocuments();

    res.status(200).json({
        inventoryItems,
        totalInventories,
    });
}

module.exports.edit = async (req, res) => {
    const { inventoryId, templeId } = req.params; 
    const inventoryData = req.body; 

    if (!inventoryId) {
        throw new ExpressError(400, "InventoryId is required.");
    }
    if (!templeId) {
        throw new ExpressError(400, "TempleId is required.");
    }
    if (!inventoryData) {
        throw new ExpressError(400, "Please provide valid Inventory Item.");
    }

    // Validate inventoryData structure
    const allowedFields = ['name', 'category', 'quantity', 'unit', 'unitPrice', 'totalPrice', 'description'];
    const keys = Object.keys(inventoryData);
    
    for (const key of keys) {
        if (!allowedFields.includes(key)) {
            throw new ExpressError(400, `Invalid field: ${key}`);
        }
    }

    const inventoryItem = await InventoryItem.findOne({ _id: inventoryId, templeId: templeId });

    if (!inventoryItem) {
        throw new ExpressError(404, "Inventory not found.");
    }

    // Update inventory fields
    for (const key of keys) {
        inventoryItem[key] = inventoryData[key];
    }

    await inventoryItem.save();

    res.status(200).json({ message: "Inventory updated successfully!" });
};

module.exports.delete = async (req, res) => {
    const { inventoryId, templeId } = req.params;

    if (!inventoryId) {
        throw new ExpressError(400, "InventoryId is required.");
    }
    if (!templeId) {
        throw new ExpressError(400, "TempleId is required.");
    }

    const inventoryItem = await InventoryItem.findOne({ _id: inventoryId, templeId: templeId });

    if (!inventoryItem) {
        throw new ExpressError(404, "Inventory not found.");
    }

    await InventoryItem.deleteOne({ _id: inventoryId, templeId: templeId });

    res.status(200).json({ message: "Inventory deleted successfully." });
};