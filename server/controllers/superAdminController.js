const ExpressError = require("../utils/ExpressError");
const Temple  = require("../models/temple");
const SuperAdmin = require("../models/superAdmin");
const bcryptjs = require("bcryptjs");
const salt = bcryptjs.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET ;

//create route handler
module.exports.createController = async(req ,res)=> {
    const { templeId, username , email , password } = req.body ; 

    // Check if temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    // Check if a super admin already exists for the temple
    const isSuperAdmin = await SuperAdmin.findOne({templeId});
    if(isSuperAdmin) {
        throw new ExpressError(400, "A super admin already exists for this temple");
    }

    // Create super admin
    let superAdmin = new SuperAdmin({
        username,
        email,
        templeId : temple._id,
        password :  bcryptjs.hashSync(password, salt),
    });

    // Save super admin
    superAdmin  = await superAdmin.save();

    const token = jwt.sign({
        id : superAdmin._id,
        superAdmin : true,
    }, secret);
    const { password : pass, ...rest } = superAdmin._doc;

    res.status(200).cookie("access_token", token, { httpOnly : true }).json({
        currUser : rest,
    });
}

//signin route handler
module.exports.signinController = async(req ,res)=> {
    const { email , password } = req.body ; 
    if(!email || !password  || email === '' || password === '') {
        throw new ExpressError(400 , "All fields are required.");
    }

    const validUser = await SuperAdmin.findOne({email});

    if(!validUser) {
        throw new ExpressError(404 , "User not found.");
    }
    const validPass = bcryptjs.compareSync( password , validUser.password );

    if(!validPass) {
        throw new ExpressError(400 , "Invalid Password.");
    }

    const token = jwt.sign({
        id : validUser._id,
        superAdmin : true,
    }, secret);
    const { password : pass, ...rest } = validUser._doc;
    res.status(200).cookie("access_token", token, { httpOnly : true }).json({ 
        rest,
    });
}

//google auth route handler
module.exports.googleController = async(req ,res)=> {
    const { email , name , googlePhotoUrl, templeId } = req.body ; 

    //if superAdmin present -> login 
    const isSuperAdmin = await SuperAdmin.findOne({email});
    if(isSuperAdmin) {
        const token = jwt.sign({ 
            id : isSuperAdmin._id,
            superAdmin : true, 
        }, secret );

        const { password , ...rest } = isSuperAdmin._doc ; 

        return res.status(200).cookie("access_token", token, { httpOnly : true }).json(rest);

    }else {
        const genRandomPass = Math.random().toString(36).slice(-8) + Math.random().toString().slice(-8);
        const hashPass = bcryptjs.hashSync(genRandomPass , salt);

        // Check if temple exists
        const temple = await Temple.findById(templeId);
        if (!temple) {
            throw new ExpressError(404, "Temple not found");
        }

        // Check if a super admin already exists for the temple
        const isSuperAdmin = await SuperAdmin.findOne({templeId});
        if(isSuperAdmin) {
            throw new ExpressError(400, "A super admin already exists for this temple");
        }

         // Create super admin
        let superAdmin = new SuperAdmin({
            username : name.trim().split(' ').join('').toLowerCase() + Math.random().toString(4).slice(-3) ,
            email,
            profilePicture : googlePhotoUrl,
            templeId : temple._id,
            password : hashPass
        });

        // Save super admin
        superAdmin  = await superAdmin.save();

        const token = jwt.sign({
            id : superAdmin._id,
            superAdmin : true,
        }, secret);
        const { password : pass, ...rest } = superAdmin._doc;

        res.status(200).cookie("access_token", token, { httpOnly : true }).json({
            currUser : rest,
        });

    }

}

//edit superAdmin rooute handler
module.exports.editController = async(req ,res)=> {
    const user = req.user ; 
    const { username , email , password, profilePicture } = req.body ; 
    const userId   = req.params.id ; 
    
    if(user.id !== userId) {
        throw new ExpressError(403 , "You are not allowed to update this user.");
    }
    if(password) {
        if(password.length < 6) {
            throw new ExpressError(400 , "Password atleast have 6 characters.")
        }
    }

    if(username) {
        if(username.length < 7 || username.length > 20) {
            throw new ExpressError(400 , "Username must be in between 7 & 20 characters.")
        }
    }

    const isSuperAdmin = await SuperAdmin.findById(userId);

    if(!isSuperAdmin) {
        throw new ExpressError(404 , "SuperAdmin not found.");
    }

    // Update only the fields that are present and not empty
    const updateFields = {};
    if (username && username !== isSuperAdmin.username) updateFields.username = username;
    if (email && email !== isSuperAdmin.email) updateFields.email = email;
    if (password) {
        const hashPass = bcryptjs.hashSync(password, salt);
        if (hashPass !== isSuperAdmin.password) updateFields.password = hashPass;
    }
    if (profilePicture && profilePicture !== isSuperAdmin.profilePicture) updateFields.profilePicture = profilePicture;

    if (Object.keys(updateFields).length === 0) {
        throw new ExpressError(400 ,"No fields to update." );
    }

    const updatedSuperAdmin = await SuperAdmin.findByIdAndUpdate(userId,{ $set: updateFields }, { new : true });

    const { password : pass, ...rest } =  updatedSuperAdmin._doc ;  
    res.status(200).json({
        currUser : rest 
    });

}

//signout route handler
module.exports.signoutController = (req ,res)=> {
    res.clearCookie('access_token').status(200).json('User signout successfully.');
}