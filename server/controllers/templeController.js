const mongoose = require("mongoose");
const Temple = require("../models/temple");
const Daan  = require("../models/daanSchema");
const Role = require("../models/roleSchema");
const User = require("../models/userSchema");
const Permission = require("../models/permissionSchema");
const SuperAdmin = require("../models/superAdmin");
const ExpressError = require("../utils/ExpressError");


//create temple  route  handler
module.exports.addController = async(req ,res)=> {
    const { name, location } = req.body;

    if (!name || !location) { 
        throw new ExpressError(400, "Please provide all the details.");
    }

    let newTemple = await Temple.create({ name, location });

    newTemple = await newTemple.save();

    res.status(200).json({
        temple : newTemple
    });
}  

//get temple route  handler
module.exports.getController = async(req , res)=> {
    const { user } = req ; 
    const templeId = req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400, "Unothorized.");
    }

    if(!templeId) {
        throw new ExpressError(400 , "Temple id not found.");
    }

    const temple = await Temple.findById(templeId);

    res.status(200).json({temple});

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
        const totalDonationCount  =  await Daan.countDocuments({temple : templeId});
        const totalUserCount = await User.countDocuments({templeId : templeId});
        const totalRoleCount = await Role.countDocuments({templeId : templeId});
        const totalPermissionCount = await Permission.countDocuments({templeId : templeId});
    
        const pastSevenMonthsData = generatePastSevenMonthsData();

        const donationCounts = await calculateDonationCounts(templeId, pastSevenMonthsData);

        const donationData = await calculateDonationData(templeId, pastSevenMonthsData);

        res.status(200).json({ message: "Analytics on the way.", 
            donationCounts, 
            donationData, 
            totalDonationCount,
            totalUserCount,
            totalRoleCount,
            totalPermissionCount, 
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
            0 ,
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
        // Extract start and end dates for the current month
        const { start, end } = monthData;

        const totalAmntCount = await Daan.aggregate([
            { $match: { 
                temple : new mongoose.Types.ObjectId(templeId),
                createdAt: { $gte: start, $lte: end }
            }},
            { $group : { 
                _id : null,
                totalDonationAmount  : {$sum : '$donationAmount'} 
            } }
        ]);

        // Get total donation amount for the current month
        const totalDonationAmount = totalAmntCount.length > 0 ? totalAmntCount[0].totalDonationAmount : 0;

        // Push month and total donation amount to donationData array
        donationData.push({ month: start, donationAmount: totalDonationAmount });
    }
    // Return the donationData array after processing all months
    return donationData;
};

