const { model } = require("mongoose");
const User = require("../models/userSchema");
const ExpressError = require("../utils/ExpressError");
const bcryptjs = require("bcryptjs");
const salt = 10 ;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET ;


//signin controller
module.exports.signinController = async(req ,res)=> {
    const { email , password } = req.body ; 
    if(!email || !password  || email === '' || password === '') {
        throw new ExpressError(400 , "All fields are required.");
    }

    const validUser = await User.findOne({email}).populate({
        path : "roles",
        populate : {
            path : "permissions",
            model : "Permission"
        }
    });

    if(!validUser) {
        throw new ExpressError(404 , "User not found.");
    }
    const validPass = bcryptjs.compareSync( password , validUser.password );

    if(!validPass) {
        throw new ExpressError(400 , "Invalid Password.");
    }

    const token = jwt.sign({
        id : validUser._id,
        superAdmin : false,
        permissions :  validUser.roles.flatMap(role => role.permissions.flatMap(permission => permission.actions)),
    }, secret);
    const { password : pass, ...rest } = validUser._doc;
    res.status(200).cookie("access_token", token, { httpOnly : true }).json({ 
        rest,
    });
}


//create user route  handler 
module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const formData = req.body ; 
    const templeId = req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400 , "Admin not found.");
    }

    if(!formData.username || !formData.email || !formData.password || !Array.isArray(formData.roles)) {
        throw new ExpressError(400 , "Invalid data formate.");
    }

    const  isUserDuplicate = await User.findOne({  username : formData.username, email : formData.email });

    if(isUserDuplicate) {
        throw new ExpressError(400, "Username or Email already taken.Try with new one.")
    }
    if(!templeId) {
        throw new ExpressError(400 , "Access denied.");
    }

    const hashPass = bcryptjs.hashSync(formData.password , salt);

    const newUser = new User({
        username : formData.username,
        email : formData.email,
        password : hashPass,
        roles : formData.roles,
        templeId : templeId ,
    });

    try {
        await newUser.save();
        res.status(200).json("New user created successfully.");
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error, indicating that username or email is already taken
            throw new ExpressError(400, "Username or Email already taken.");
        } else {
            // Other Mongoose errors
            throw new ExpressError(500, "Internal Server Error");
        }
    }
}

//get users route handler
module.exports.getController =  async(req ,res)=> {
    const user = req.user ; 
    const templeId =  req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400 , "Admin not found.");
    }

    if(!templeId) {
        throw new ExpressError(400 , "Access denied.");
    }

    const allUser = await User.find({ templeId }).populate({
        path : "roles",
        populate : {
            path : "permissions",
            model : "Permission",
        }
    });

    res.status(200).json({ allUser })
}

//edit user roure handler
module.exports.editController = async(req ,res)=> {
    const user = req.user ; 
    const formData = req.body ; 
    const { templeId, userId } = req.params ; 

    const userToUpdate = await User.findOne({ _id: userId, templeId : templeId });
    if(!userToUpdate) {
        throw new ExpressError(400 , "User not found.");
    }

    if(!userToUpdate._id.equals(userId)) {
        if(!user.superAdmin) {
        throw new ExpressError(401 , "Permission not granted to update this user.");
        }
    }
    if(!formData) {
        throw new ExpressError(400 , "Invalid form data.");
    }

    // preparing fields to  be updated 
    const updateObj = {};
    if (formData.username) {
        updateObj.username = formData.username;
    }
    if (formData.email) {
        updateObj.email = formData.email;
    }
    if (formData.profilePicture) {
        updateObj.profilePicture = formData.profilePicture;
    }
    if (formData.password) {
        if (formData.password.length < 6) {
            throw new ExpressError(400, "Password must contain atleast 6 characters.");
        }
        const hashPass = bcryptjs.hashSync(formData.password, salt);
        updateObj.password = hashPass;
    }
    if (formData.roles) {
        updateObj.roles = formData.roles;
    }

    // Update the user with the provided fields
    const updatedUser = await User.findByIdAndUpdate( { _id: userId , templeId : templeId }, updateObj, { new: true }).populate({
        path : "roles",
        populate : {
            path : "permissions",
            model : "Permission",
        }
    });

    res.status(200).json({ updatedUser });
}

//delete user route handler
module.exports.deleteController = async(req ,res)=> {
    const user = req.user ; 
    const { templeId, userId } = req.params; 

    if(!userId && !templeId) {
        throw new ExpressError("Id not found.");
    }
    const  userToDelete = await User.findOne({ _id : userId , templeId : templeId });

    if(!userToDelete) {
        throw new ExpressError(400 , "User not found.");
    }

    if(!user.superAdmin || !userToDelete.equals(userId)) {
        throw new ExpressError(401 , "Permission not granted to update this user.");
    }

    await User.findOneAndDelete({_id : userId , templeId : templeId });
    res.status(200).json("User delete Successfully.");
}