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

module.exports.getInventories = async (req, res) => {
    const { templeId } = req.params;
    const { searchTerm, category, minQuantity, maxQuantity, unit, minUnitPrice, maxUnitPrice, minTotalPrice, maxTotalPrice } = req.query;

    if (!templeId) {
        throw new ExpressError(400, "TempleId required.");
    }

    // Building filter object dynamically based on the query parameters
    const filter = { templeId };

    if (searchTerm) {
        filter.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
    }
    if (category) {
        filter.category = category;
    }
    if (minQuantity) {
        filter.quantity = { ...filter.quantity, $gte: Number(minQuantity) };
    }
    if (maxQuantity) {
        filter.quantity = { ...filter.quantity, $lte: Number(maxQuantity) };
    }
    if (unit) {
        filter.unit = unit;
    }
    if (minUnitPrice) {
        filter.unitPrice = { ...filter.unitPrice, $gte: Number(minUnitPrice) };
    }
    if (maxUnitPrice) {
        filter.unitPrice = { ...filter.unitPrice, $lte: Number(maxUnitPrice) };
    }
    if (minTotalPrice) {
        filter.totalPrice = { ...filter.totalPrice, $gte: Number(minTotalPrice) };
    }
    if (maxTotalPrice) {
        filter.totalPrice = { ...filter.totalPrice, $lte: Number(maxTotalPrice) };
    }

    // Fetch the inventory items based on the filter
    const inventoryItems = await InventoryItem.find(filter);
    const totalInventories = await InventoryItem.countDocuments({ templeId });

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