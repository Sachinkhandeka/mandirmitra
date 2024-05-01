const Daan = require("../models/daanSchema");
const Temple = require("../models/temple");
const ExpressError = require("../utils/ExpressError");

//create daan route handler
module.exports.createDaanController = async(req ,res)=> {
    const formData = req.body;
    const templeId = req.params.templeId ; 

    const isTemple = await Temple.findById(templeId);
    if(!isTemple) {
        throw new ExpressError(400 , "Caanot add donation without temple.")
    }

    if(!formData) {
        throw new ExpressError(400 , "Donation fields cant be empty!");
    }

    const newDaan = new Daan({...formData ,  temple : templeId });
    await newDaan.save();

    const populatedDaan = await Daan.findById(newDaan._id).populate("temple");
    res.status(200).json({
        newDaan: populatedDaan,
    });
}


//get all daan data route handler
module.exports.getDataController = async(req ,res)=> {
    const templeId = req.params.templeId ;  
    const startIndx = parseInt(req.query.startIndx) || 0 ; 
    const sortDirection = req.query.sortDirection === "asc"? 1 : -1 ; 

    //check if templeId not present
    if(!templeId) {
        throw new  ExpressError(400 , "Cannot get donation without temple");
    }

    // Define search criteria based on query parameters
    const searchCriteria = {
        temple: templeId,
    };  

    // Add optional search criteria if present in query parameters
    if (req.query.paymentMethod) searchCriteria.paymentMethod = req.query.paymentMethod;
    if (req.query.village) searchCriteria.village = { $regex: req.query.village, $options: 'i' };
    if (req.query.tehsil) searchCriteria.tehsil = { $regex: req.query.tehsil, $options: 'i' };
    if (req.query.district) searchCriteria.district = { $regex: req.query.district, $options: 'i' };
    if (req.query.state) searchCriteria.state = { $regex: req.query.state, $options: 'i' };
    if (req.query.country) searchCriteria.country = { $regex: req.query.country, $options: 'i' };
    if (req.query.searchTerm) {
        searchCriteria.$or = [
            { donorName: { $regex: req.query.searchTerm, $options: 'i' } },
            { sevaName: { $regex: req.query.searchTerm, $options: 'i' } },
            { village: { $regex: req.query.searchTerm, $options: 'i' } },
        ];
    }

    // Add range search for donationAmount if minAmnt and maxAmnt parameters are present
    if (req.query.minAmnt || req.query.maxAmnt) {
        searchCriteria.donationAmount = {};
        if (req.query.minAmnt) searchCriteria.donationAmount.$gte = parseFloat(req.query.minAmnt);
        if (req.query.maxAmnt) searchCriteria.donationAmount.$lte = parseFloat(req.query.maxAmnt);
    }

    // Fetch daans based on search criteria
    const daans = await Daan.find(searchCriteria)
    .skip(startIndx)
    .sort({ updatedAt: sortDirection })
    .populate("temple");

   // Fetch total count of daans based on search criteria
   const total = await Daan.countDocuments(searchCriteria);

   // Fetch count of daans from last month based on search criteria
   const now = new Date();
   const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
    );

    const lastMonthDaan = await Daan.countDocuments({
        ...searchCriteria,
        createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({
        daans,
        total,
        lastMonthDaan,
    });
}

//get one daan route handler
module.exports.getOneDaanController = async(req ,res)=> {
    const { templeId, id } = req.params; 

    if( !templeId && !id) {
        throw new ExpressError(400 , "Id not found");
    }

    const daan = await Daan.findOne({_id : id , temple : templeId});

    res.status(200).json({
        daan,
    });
}

//update daan route handler
module.exports.updateDaanController = async(req ,res)=> {
    const data = req.body; 
    const { templeId, id } = req.params ; 
    if(!templeId && !id) {
        throw new ExpressError(404 , "id not found");
    }
    if(!data) {
        throw new ExpressError(400 , "Please provide data to update this daan");
    }

    //remove empty feilds from data
    Object.keys(data).map( key => {
        if(!data[key]) {
            delete data[key];
        }
    });

    const updatedDonation = await Daan.findOneAndUpdate({ _id : id , temple : templeId }, { $set : data }, { new : true }).populate("temple");

    res.status(200).json({
        message : "Daan update successfully",
        updatedDonation,
    });
}

//delete daan route handler
module.exports.deleteDaanController = async(req ,res)=> {
    const{ templeId, id }= req.params; 

    if(!templeId && !id) {
        throw new ExpressError(400 , "Invalid id or id not found");
    }

    await Daan.findOneAndDelete({ _id : id , temple : templeId });

    res.status(200).json("The daan has been delete successfully");
}