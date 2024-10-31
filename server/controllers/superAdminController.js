const ExpressError = require("../utils/ExpressError");
const Temple  = require("../models/temple");
const SuperAdmin = require("../models/superAdmin");
const User = require("../models/userSchema");
const bcryptjs = require("bcryptjs");
const salt = bcryptjs.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET ;


module.exports.singinWithPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        // Check in SuperAdmin collection
        let existingUser = await SuperAdmin.findOne({ phoneNumber: phoneNumber });
        let admin = true;
        
        // If not found in SuperAdmin, check in User collection
        if (!existingUser) {
            existingUser = await User.findOne({ phoneNumber: phoneNumber }).populate({
                path : "roles",
                populate : {
                    path : "permissions",
                    model : "Permission",
                }
            });
            admin = false;
        }

        if (existingUser) {
            // Prepare the payload for the JWT token
            const payload = {
                id : existingUser._id,
                superAdmin : admin,
            }
            
            if (!admin && Array.isArray(existingUser.roles)) {
                // If the user is not an admin, include permissions in the payload
                payload.permissions = existingUser.roles.flatMap(role => 
                    Array.isArray(role.permissions) ? role.permissions.flatMap(permission => permission.actions) : []
                );
            }

            //generate  GWT token
            const token = jwt.sign(payload, secret, { expiresIn : '7d' });

            // Omit password field from response
            const { password, ...rest } = existingUser._doc;
            
            // Return response with token and user data
            return res.status(200).cookie("access_token", token, { httpOnly: true }).json({ currUser: rest });
        } else {
            // User does not exist, return a response indicating that they need to sign up
            return res.status(200).json({ needsSignup: true });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//create route handler
module.exports.createController = async(req ,res)=> {
    const { templeId, username , email , password, phoneNumber } = req.body ; 

    try {
        // Check if temple exists
        const temple = await Temple.findById(templeId);
        if (!temple) {
            throw new ExpressError(404, "Temple not found");
        }

        // Check if a super admin already exists for the temple
        const isSuperAdmin = await SuperAdmin.findOne({ templeId });
        if (isSuperAdmin) {
            throw new ExpressError(400, "A super admin already exists for this temple");
        }
        // Create super admin
        let superAdmin = new SuperAdmin({
            username,
            email,
            templeId: temple._id,
            phoneNumber : phoneNumber,
            password: bcryptjs.hashSync(password, salt),
        });

        // Save super admin
        superAdmin = await superAdmin.save();

        // Generate JWT token
        const token = jwt.sign({
            id: superAdmin._id,
            superAdmin: true,
        }, secret,{ expiresIn: '7d' });

        // Omit password field from response
        const { password: pass, ...rest } = superAdmin._doc;

        // Set token in cookie and send response
        res.status(200).cookie("access_token", token, { httpOnly: true }).json({
            currUser: rest,
        });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error, indicating that username or email is already taken
            throw new ExpressError(400, "Username or Email already taken. Please try with a new one.");
        } else {
            // Other errors
            throw new ExpressError(500, "Internal Server Error");
        }
    }
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
    }, secret,{ expiresIn: '7d' });
    const { password : pass, ...rest } = validUser._doc;
    res.status(200).cookie("access_token", token, { httpOnly : true }).json({ 
        rest,
    });
}

//google auth route handler
module.exports.googleController = async(req ,res)=> {
    const { email , name , googlePhotoUrl, phoneNumber, templeId } = req.body ; 

    //if superAdmin present -> login 
    const isSuperAdmin = await SuperAdmin.findOne({email});
    if(isSuperAdmin) {
        const token = jwt.sign({ 
            id : isSuperAdmin._id,
            superAdmin : true, 
        }, secret );
        
        const { password , ...rest } = isSuperAdmin._doc ; 

        return res.status(200).cookie("access_token", token, { httpOnly : true }).json({
            currUser : rest,
        });

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
            phoneNumber : phoneNumber,
            templeId : temple._id,
            password : hashPass
        });

        // Save super admin
        superAdmin  = await superAdmin.save();

        const token = jwt.sign({
            id : superAdmin._id,
            superAdmin : true,
        }, secret,{ expiresIn: '7d' });
        const { password : pass, ...rest } = superAdmin._doc;

        res.status(200).cookie("access_token", token, { httpOnly : true }).json({
            currUser : rest,
        });

    }

}

//edit superAdmin rooute handler
module.exports.editController = async(req ,res)=> {
    const user = req.user ; 
    const { username , email , phoneNumber, password, profilePicture } = req.body ; 
    const { templeId, id }   = req.params; 
    
    if(user.id !== id && !templeId ) {
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

    const isSuperAdmin = await SuperAdmin.findOne({_id: id, templeId : templeId});

    if(!isSuperAdmin) {
        throw new ExpressError(404 , "SuperAdmin not found.");
    }

    // Update only the fields that are present and not empty
    const updateFields = {};
    if (username && username !== isSuperAdmin.username) updateFields.username = username;
    if (email && email !== isSuperAdmin.email) updateFields.email = email;
    if(phoneNumber && phoneNumber !== isSuperAdmin.phoneNumber) updateFields.phoneNumber = phoneNumber ; 
    if (password) {
        const hashPass = bcryptjs.hashSync(password, salt);
        if (hashPass !== isSuperAdmin.password) updateFields.password = hashPass;
    }
    if (profilePicture && profilePicture !== isSuperAdmin.profilePicture) updateFields.profilePicture = profilePicture;

    if (Object.keys(updateFields).length === 0) {
        throw new ExpressError(400 ,"No fields to update." );
    }

    const updatedSuperAdmin = await SuperAdmin.findOneAndUpdate({_id:id , templeId : templeId },{ $set: updateFields }, { new : true });

    const { password : pass, ...rest } =  updatedSuperAdmin._doc ;  
    res.status(200).json({
        currUser : rest 
    });

}

//signout route handler
module.exports.signoutController = (req ,res)=> {
    res.clearCookie('access_token').status(200).json('User signout successfully.');
}