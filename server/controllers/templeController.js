const mongoose = require("mongoose");
const Temple = require("../models/temple");
const Daan = require("../models/daanSchema");
const Role = require("../models/roleSchema");
const User = require("../models/userSchema");
const Permission = require("../models/permissionSchema");
const Expense = require("../models/expenseSchema");
const InventoryItem = require("../models/inventorySchema");
const ExpressError = require("../utils/ExpressError");
const Devotee = require("../models/devotee");

//create temple route handler
module.exports.addController = async (req, res) => {
    const { name, location } = req.body.templeData;

    if (!name || !location) { 
        throw new ExpressError(400, "Please provide all the details.");
    }

    let newTemple = await Temple.create({ name, location });

    newTemple = await newTemple.save();

    res.status(200).json({
        temple: newTemple
    });
}

// Get all temples for public view (no authentication needed)
module.exports.getAllTemplesController = async (req, res) => {
    try {
        // Extract the search query from the request
        const { search } = req.query;

        // Define a query object
        let query = {};

        // If a search term is provided, search across multiple fields using $regex
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } }, // Search by temple name (case-insensitive)
                    { alternateName: { $regex: search, $options: "i" } }, // Search by alternate name
                    { location: { $regex: search, $options: "i" } }, // Search by location
                    { description: { $regex: search, $options: "i" } }, // Search by description
                    { "godsAndGoddesses.name": { $regex: search, $options: "i" } }, // Search by deity name
                ],
            };
        }

        // Fetch all temples based on the query
        const temples = await Temple.find(query);

        // Return temples in the response
        res.status(200).json({
            message: "List of all temples",
            temples,
        });
    } catch (err) {
        // Handle error gracefully
        res.status(500).json({
            error: "An error occurred while fetching temples",
            details: err.message,
        });
    }
};

//get temple route handler
module.exports.getController = async (req, res) => {
    const { user } = req;
    const templeId = req.params.templeId;

    if (!user) {
        throw new ExpressError(400, "Unauthorized.");
    }

    if (!templeId) {
        throw new ExpressError(400, "Temple id not found.");
    }

    const temple = await Temple.findById(templeId);

    res.status(200).json({ temple });
}

// Get one temple for public view (no authentication needed)
module.exports.getOneTempleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if the ID parameter is provided
        if (!id) {
            throw new ExpressError(400, "Temple ID is required.");
        }

        // Find the temple by ID
        const temple = await Temple.findById(id);

        // If the temple is not found, throw an error
        if (!temple) {
            throw new ExpressError(404, "Temple not found.");
        }

        await temple.populate("anuyayi", "displayName photoURL");
        // If temple is found, send the response
        res.status(200).json({
            message: "Temple details fetched successfully",
            temple,
        });
    } catch (err) {
        throw new ExpressError(500, "An error occurred while fetching the temple details.");
    }
};

//edit controller 
module.exports.editController = async (req, res) => {
    const { templeData } = req.body;
    const { templeId, type } = req.params;
    if (!templeId) {
        throw new ExpressError(400, "Temple ID required.");
    }

    // Map the `type` parameter to the specific fields in the `Temple` model
    const templeFields = {
        genInfo: ["name", "alternateName", "location", "image", "foundedYear", "description", "historyImages"],
        gods: "godsAndGoddesses",
        festivals: "festivals",
        pujaris: "pujaris",
        management: "management",
        videos: "videos",
    };

    // Check if `type` is valid
    const fieldsToUpdate = templeFields[type];
    if (!fieldsToUpdate) {
        throw new ExpressError(400, "Invalid type provided.");
    }

    // Build the update object based on `type`
    const updateObject = {};

    if (Array.isArray(fieldsToUpdate)) {
        // If the `type` refers to general temple details, update multiple fields
        fieldsToUpdate.forEach(field => {
            if (templeData[field] !== undefined) updateObject[field] = templeData[field];
        });
    } else {
        // If `type` refers to a specific array field, update that field directly
        updateObject[fieldsToUpdate] = templeData[fieldsToUpdate];
    }

    // Find and update the temple by ID
    const updatedTemple = await Temple.findByIdAndUpdate(
        templeId,
        { $set: updateObject },
        { new: true, runValidators: true }
    );

    if (!updatedTemple) {
        throw new ExpressError(404, "Temple not found.");
    }

    res.status(200).json({
        message: "Temple updated successfully",
        temple: updatedTemple
    });
};


module.exports.analyticalController = async (req, res) => {
    try {
        const { templeId } = req.params;
        const { user } = req;

        // Authorization check
        if (!user) {
            throw new ExpressError(400, "Authorization failed.");
        }

        // Check if templeId exists
        if (!templeId) {
            throw new ExpressError(400, "TempleId not found.");
        }

        // Existing analytics
        const totalDonationCount  =  await Daan.countDocuments({ temple: templeId });
        const totalExpenseCount = await Expense.countDocuments({ temple: templeId });
        const totalUserCount = await User.countDocuments({ templeId: templeId });
        const totalRoleCount = await Role.countDocuments({ templeId: templeId });
        const totalPermissionCount = await Permission.countDocuments({ templeId: templeId });

        const pastSevenMonthsData = generatePastSevenMonthsData();

        const donationCounts = await calculateDonationCounts(templeId, pastSevenMonthsData);
        const donationData = await calculateDonationData(templeId, pastSevenMonthsData);

        const expenseCounts = await calculateExpenseCounts(templeId, pastSevenMonthsData);
        const expenseData = await calculateExpenseData(templeId, pastSevenMonthsData);

        // New analytics
        const totalInventoryValue = await calculateTotalInventoryValue(templeId);
        const lowStockItemsCount = await countLowStockItems(templeId);
        const outOfStockItemsCount = await countOutOfStockItems(templeId);
        const inventoryCategoryBreakdown = await calculateInventoryCategoryBreakdown(templeId);
        const inventoryQuantities = await calculateInventoryQuantity(templeId);

        res.status(200).json({
            donationCounts,
            expenseCounts,
            donationData,
            expenseData,
            totalDonationCount,
            totalExpenseCount,
            totalUserCount,
            totalRoleCount,
            totalPermissionCount,
            totalInventoryValue,
            lowStockItemsCount,
            outOfStockItemsCount,
            inventoryCategoryBreakdown,
            inventoryQuantities,
        });
    } catch (err) {
        throw new ExpressError(err.status || 400, err.message);
    }
};

module.exports.anuyayi = async (req , res)=> {
    const { templeId, devoteeId } = req.params ; 
    
    const temple = await Temple.findById(templeId);

    if(!temple) {
        throw new ExpressError(404, "Temple not found.");
    }

    const devotee = await Devotee.findById(devoteeId);

    if(!devotee) {
        throw new ExpressError(404, "User not found.");
    }

    const isAnuyayi = temple.anuyayi.includes(devoteeId);

    if(isAnuyayi) {
        temple.anuyayi = temple.anuyayi.filter(id => id.toString() !== devoteeId);
        await temple.save();
    }else {
        temple.anuyayi.push(devoteeId);
        await temple.save();
    }
    await temple.populate("anuyayi", "displayName photoURL");
    return res.status(200).json({
        message: isAnuyayi ? "Successfully anutyaag the temple." : "Successfully anuyayi the temple.",
        temple: temple
    });
}

module.exports.likeDislikeController = async (req, res) => {
    const { templeId, entityId, entityType } = req.params;
    const devoteeId = req.user._id;

    if (!devoteeId) {
        throw new ExpressError(401, "Unauthorized request");
    }

    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    // Validate user
    const devotee = await Devotee.findById(devoteeId);
    if (!devotee) {
        throw new ExpressError(401, "Please signup/login to like");
    }

    // Validate entityType and find the entity
    const validEntityTypes = ["godsAndGoddesses", "festivals", "videos", "pujaris", "management"];
    if (!validEntityTypes.includes(entityType)) {
        throw new ExpressError(400, `Invalid entity type: ${entityType}`);
    }

    // Locate the specific entity within the temple
    const entity = temple[entityType].id(entityId);
    if (!entity) {
        throw new ExpressError(404, `${entityType} not found`);
    }

    // Check if the user already liked the entity
    const isLiked = entity.likes.some((like) => like.toString() === devoteeId.toString());
    if (isLiked) {
        entity.likes.pull(devoteeId); // Remove like
    } else {
        entity.likes.push(devoteeId); // Add like
    }

    await temple.save();

    res.status(200).json({
        message: isLiked
            ? `${entityType.slice(0, -1)} unliked successfully` // Remove plural for readability
            : `${entityType.slice(0, -1)} liked successfully`,
            entity
    });
}

// Function to generate the start and end dates for each of the past seven months
const generatePastSevenMonthsData = () => {
    const pastSevenMonthsData = [];
    for (let i = 0; i < 7; i++) {
        const curr = new Date();
        const pastMonthStart = new Date(
            curr.getFullYear(),
            curr.getMonth() - i,
            1,
            0,
            0,
            0,
        );
        const pastMonthEnd = new Date(
            curr.getFullYear(),
            curr.getMonth() - i + 1,
            0,
            23,
            59,
            59,
        );
        pastSevenMonthsData.push({ start: pastMonthStart, end: pastMonthEnd });
    }
    return pastSevenMonthsData;
};

// Function to calculate donation counts for each of the past seven months
const calculateDonationCounts = async (templeId, pastSevenMonthsData) => {
    const donationCounts = [];
    for (const monthData of pastSevenMonthsData) {
        const count = await Daan.countDocuments({
            temple: templeId,
            createdAt: { $gte: monthData.start, $lte: monthData.end }
        });
        donationCounts.push({ month: monthData.start, count });
    }
    return donationCounts;
};

const calculateDonationData = async (templeId, pastSevenMonthsData) => {
    const donationData = [];

    for (const monthData of pastSevenMonthsData) {
        const { start, end } = monthData;

        const totalAmntCount = await Daan.aggregate([
            { $match: { 
                temple: new mongoose.Types.ObjectId(templeId),
                createdAt: { $gte: start, $lte: end }
            }},
            { $group: { 
                _id: null,
                totalDonationAmount: { $sum: '$donationAmount' } 
            }}
        ]);

        const totalDonationAmount = totalAmntCount.length > 0 ? totalAmntCount[0].totalDonationAmount : 0;
        donationData.push({ month: start, amount: totalDonationAmount });
    }

    return donationData;
};

const calculateExpenseCounts = async (templeId, pastSevenMonthsData) => {
    const expenseCounts = [];
    for (const monthData of pastSevenMonthsData) {
        const count = await Expense.countDocuments({
            temple: templeId,
            date: { $gte: monthData.start, $lte: monthData.end }
        });
        expenseCounts.push({ month: monthData.start, count });
    }
    return expenseCounts;
};

const calculateExpenseData = async (templeId, pastSevenMonthsData) => {
    const expenseData = [];

    for (const monthData of pastSevenMonthsData) {
        const { start, end } = monthData;

        const totalAmountCount = await Expense.aggregate([
            { $match: { 
                temple: new mongoose.Types.ObjectId(templeId),
                date: { $gte: start, $lte: end },
                status: { $ne: "rejected" }
            }},
            { $group: { 
                _id: null,
                totalExpenseAmount: { $sum: '$amount' } 
            }}
        ]);

        const totalExpenseAmount = totalAmountCount.length > 0 ? totalAmountCount[0].totalExpenseAmount : 0;
        expenseData.push({ month: start, amount: totalExpenseAmount });
    }

    return expenseData;
};

// Function to calculate total inventory value
const calculateTotalInventoryValue = async (templeId) => {
    const totalValue = await InventoryItem.aggregate([
        { $match: { templeId: new mongoose.Types.ObjectId(templeId) }},
        { $group: { _id: null, totalValue: { $sum: { $multiply: ['$quantity', '$unitPrice'] } } }}
    ]);
    return totalValue.length > 0 ? totalValue[0].totalValue : 0;
};

// Function to count low stock items
const countLowStockItems = async (templeId) => {
    return await InventoryItem.countDocuments({ templeId: templeId, quantity: { $lt: 5, $gt: 0 } });
};

// Function to count out of stock items
const countOutOfStockItems = async (templeId) => {
    return await InventoryItem.countDocuments({ templeId: templeId, quantity: 0 });
};

// Function to calculate inventory category breakdown
const calculateInventoryCategoryBreakdown = async (templeId) => {
    const breakdown = await InventoryItem.aggregate([
        { $match: { templeId: new mongoose.Types.ObjectId(templeId) }},
        { $group: { _id: "$category", count: { $sum: 1 } }}
    ]);
    return breakdown;
};

const calculateInventoryQuantity = async (templeId) => {
    const quantities = await InventoryItem.aggregate([
        { $match: { templeId: new mongoose.Types.ObjectId(templeId) }},
        { $group: { _id: "$name", count: { $sum: "$quantity" } }}
    ]);

    return quantities;
};
