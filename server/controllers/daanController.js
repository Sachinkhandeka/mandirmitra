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
    const startIndx = parseInt(req.query.startIndx) || 0 ; 
    const sortDirection = req.query.sortDirection === "asc"? 1 : -1 ; 

    const daans = await Daan.find({
        ...(req.query.paymentMethod && { paymentMethod : req.query.paymentMethod }),
        ...(req.query.taluko && { taluko : req.query.taluko }),
        ...(req.query.searchTerm && {
            $or : [
                {name : { $regex : req.query.searchTerm , $options : 'i' }},
                { seva : { $regex : req.query.searchTerm , $options : 'i' } },
                { gaam : { $regex : req.query.searchTerm , $options : 'i' } },
            ],
        })
    }).skip(startIndx).sort({ updatedAt: sortDirection });

    const total = await Daan.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate(),
    );

    const lastMonthDaan = await Daan.countDocuments({ createdAt : { $gte : oneMonthAgo } });

    res.status(200).json({
        daans,
        total,
        lastMonthDaan,
    });
}

//get one daan route handler
module.exports.getOneDaanController = async(req ,res)=> {
    const id = req.params.id ; 

    if(!id) {
        throw new ExpressError(400 , "Id not found");
    }

    const daan = await Daan.findById(id);

    res.status(200).json({
        daan,
    });
}

//update daan route handler
module.exports.updateDaanController = async(req ,res)=> {
    const data = req.body.daan ; 
    const id = req.params.id ; 

    if(!id) {
        throw new ExpressError(404 , "id not found");
    }
    if(!data) {
        throw new ExpressError(400 , "Please provide data to update this daan");
    }

    const updatedDaan = await Daan.findByIdAndUpdate(id , {
        $set : {
            name : data.name,
            gaam : data.gaam,
            taluko : data.taluko,
            seva : data.seva,
            paymentMethod : data.paymentMethod,
            mobileNumber : data.mobileNumber,
            amount : data.amount,
        }
    }, { new : true });

    res.status(200).json({
        message : "Daan update successfully",
        updatedDaan,
    });
}

//delete daan route handler
module.exports.deleteDaanController = async(req ,res)=> {
    const id = req.params.id ; 

    if(!id) {
        throw new ExpressError(400 , "Invalid id or id not found");
    }

    await Daan.findByIdAndDelete(id);

    res.status(200).json("The daan has been delete successfully");
}