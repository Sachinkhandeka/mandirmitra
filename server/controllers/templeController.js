const mongoose = require("mongoose");
const Temple = require("../models/temple");
const Daan = require("../models/daanSchema");
const Role = require("../models/roleSchema");
const User = require("../models/userSchema");
const Permission = require("../models/permissionSchema");
const Expense = require("../models/expenseSchema");
const InventoryItem = require("../models/inventorySchema");
const ExpressError = require("../utils/ExpressError");

//create temple route handler
module.exports.addController = async (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) { 
        throw new ExpressError(400, "Please provide all the details.");
    }

    let newTemple = await Temple.create({ name, location });

    newTemple = await newTemple.save();

    res.status(200).json({
        temple: newTemple
    });
}

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

//edit controller 
module.exports.editController = async (req, res) => {
    const { templeData } = req.body;
    const { templeId } = req.params;

    if (!templeId) {
        throw new ExpressError(400, "Temple id required.");
    }
    const updateObject = {};

    // General temple details
    if (templeData.name) updateObject.name = templeData.name;
    if (templeData.alternateName) updateObject.alternateName = templeData.alternateName;
    if (templeData.location) updateObject.location = templeData.location;
    if (templeData.image) updateObject.image = templeData.image;
    if (templeData.foundedYear) updateObject.foundedYear = templeData.foundedYear;
    if (templeData.description) updateObject.description = templeData.description;
    if (templeData.historyImages) updateObject.historyImages = templeData.historyImages;

    // Gods and Goddesses
    if (templeData.godsAndGoddesses) updateObject.godsAndGoddesses = templeData.godsAndGoddesses;

    // Festivals
    if (templeData.festivals) updateObject.festivals = templeData.festivals;
    
    // Pujaris
    if (templeData.pujaris) updateObject.pujaris = templeData.pujaris;

    // Management
    if (templeData.management) updateObject.management = templeData.management;

    // Find and update the temple by ID
    const updatedTemple = await Temple.findByIdAndUpdate(
        templeId,
        { $set: updateObject }, // Update only the fields present in templeData
        { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedTemple) {
        throw new ExpressError(404, "Temple not found.");
    }

    res.status(200).json({
        message: "Temple updated successfully",
        temple: updatedTemple
    });
}

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
