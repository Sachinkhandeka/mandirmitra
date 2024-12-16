const User = require("../models/userSchema");
const ExpressError = require("../utils/ExpressError");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/nodeMailer");

const generateAccessAndRefreshToken = async(userId)=> {
    try {
        const user = await User.findById(userId);
        if(!user) {
            throw new ExpressError(401, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken };
        
    } catch (error) {
        throw new ExpressError(500, "Something went wrong while generating tokens");
    }
}


//signin controller
module.exports.signinController = async(req ,res)=> {
    const { email , password } = req.body ; 
    if(!email || !password  || email === '' || password === '') {
        throw new ExpressError(400 , "User credentials is required");
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
    const validPass = await validUser.isPasswordCorrect(password);

    if(!validPass) {
        throw new ExpressError(400 , "Invalid Password.");
    }
    const options = {
        httpOnly: true,
        secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(validUser._id);
    const { password : pass, refreshToken: rt, ...rest } = validUser._doc;
    res.status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({ 
        message : "User logged in successfully",
        rest, accessToken, refreshToken
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

    if(!formData.username || !formData.email || !formData.phoneNumber || !formData.password || !Array.isArray(formData.roles)) {
        throw new ExpressError(400 , "Invalid data formate.");
    }

    const  isUserDuplicate = await User.findOne({  username : formData.username, email : formData.email, phoneNumber : formData.phoneNumber });

    if(isUserDuplicate) {
        throw new ExpressError(400, "Username, Email or phoneNumber already taken.Try with new one.")
    }
    if(!templeId) {
        throw new ExpressError(400 , "Access denied.");
    }

    const newUser = new User({
        username : formData.username,
        email : formData.email,
        password : formData.password,
        phoneNumber : formData.phoneNumber,
        roles : formData.roles,
        templeId : templeId ,
    });

    try {
        await newUser.save();

        const mailOptions = {
            from : process.env.SMTP_SENDER_EMAIL,
            to : newUser.email,
            subject: "Welcome to MandirMitra: Your Journey with the Temple Begins Here!",
            html: 
                `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #007bff;">Welcome to MandirMitra, ${newUser.username}!</h2>
                        <p>Dear ${newUser.username || 'Guest'},</p>
                        <p>
                            We are delighted to have you join the MandirMitra platform, the premier solution for temple management. You have been onboarded by ${user.username}, and we are confident that your contributions will be instrumental in fulfilling the temple's mission.
                        </p>
                        <p>
                            As part of the MandirMitra team, you are entrusted with responsibilities that support the temple’s operations and help serve the community of devotees with devotion and efficiency.
                        </p>
                        <blockquote style="border-left: 4px solid #007bff; padding-left: 10px; color: #555;">
                            "Serving the temple is not just a duty, but a privilege to connect with the divine and uplift the community."
                        </blockquote>
                        <p>
                            <strong>Here’s how to get started:</strong>
                        </p>
                        <ul>
                            <li>Log in to the MandirMitra platform with the credentials shared during your onboarding.</li>
                            <li>Explore your assigned roles and permissions to familiarize yourself with your responsibilities.</li>
                            <li>If you encounter any challenges, feel free to reach out to your superAdmin(${user.phoneNumber}) or contact us for support.</li>
                        </ul>
                        <p>
                            We are excited to have you onboard, and we look forward to working with you to strengthen the temple’s mission. Let us together serve with dedication and devotion.
                        </p>
                        <p style="margin-top: 20px;">Warm regards,</p>
                        <p><strong>MandirMitra Support Team</strong></p>
                        <p style="font-size: 0.9em; color: #999;">[MandirMitra Platform]</p>
                    </div>
                `
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json("New user created successfully.");
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error, indicating that username or email is already taken
            throw new ExpressError(400, "Username, Email or phoneNumber already taken.");
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
module.exports.editController = async (req, res) => {
    const user = req.user; // Logged-in user (from middleware)
    const formData = req.body; // Data to update
    const { templeId, userId } = req.params;

    // Find the user to update
    const userToUpdate = await User.findOne({ _id: userId, templeId });
    if (!userToUpdate) {
        throw new ExpressError(400, "User not found.");
    }

    // Check permissions
    if (!userToUpdate._id.equals(userId)) {
        if (!user) {
            throw new ExpressError(401, "Permission not granted to update this user.");
        }
    }

    // Ensure there is data to update
    if (!formData || Object.keys(formData).length === 0) {
        throw new ExpressError(400, "Invalid form data.");
    }

    // Prepare fields to be updated
    const updateObj = {};
    let isPasswordUpdated = false;

    if (formData.username) {
        updateObj.username = formData.username;
    }
    if (formData.email) {
        updateObj.email = formData.email;
    }
    if (formData.phoneNumber) {
        updateObj.phoneNumber = formData.phoneNumber;
    }
    if (formData.profilePicture) {
        updateObj.profilePicture = formData.profilePicture;
    }
    if (formData.password) {
        if (formData.password.length < 6) {
            throw new ExpressError(400, "Password must contain at least 6 characters.");
        }
        // Assign password directly; pre-save middleware will handle hashing
        updateObj.password = formData.password;
        isPasswordUpdated = true;
    }
    if (formData.roles) {
        updateObj.roles = formData.roles;
    }

    // Update the user document
    Object.assign(userToUpdate, updateObj);
    await userToUpdate.save();

    // Populate roles and permissions
    const updatedUser = await User.findById(userToUpdate._id).populate({
        path: "roles",
        populate: {
            path: "permissions",
            model: "Permission",
        },
    });

    // If password was updated, send email notification
    if (isPasswordUpdated) {
        const mailOptions = {
            from : process.env.SMTP_SENDER_EMAIL,
            to: updatedUser.email,
            subject: "Your MandirMitra Account Password Has Been Updated",
            html: 
            `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #007bff;">Your Password Has Been Updated</h2>
                    <p>Dear ${updatedUser.username},</p>
                    <p>
                        We wanted to inform you that the password for your <strong>MandirMitra</strong> account has recently been updated.
                    </p>
                    <p>
                        If you made this change, no further action is needed. However, if you did not authorize this update, please take the following steps immediately:
                    </p>
                    <ol>
                        <li>Reset your password using the <strong>“Forgot Password”</strong> option on the login page.</li>
                        <li>Contact our support team at <a href=${process.env.SMTP_SENDER_EMAIL}>support@mandirmitra.com</a> for assistance.</li>
                    </ol>
                    <p>
                        <strong>Security Tip:</strong> Always use a strong and unique password that you do not reuse across different websites.
                    </p>
                    <p>
                        If you have any concerns, feel free to reach out to us. We are here to help!
                    </p>
                    <p style="margin-top: 20px;">Warm regards,</p>
                    <p><strong>MandirMitra Support Team</strong></p>
                </div>
            `
        }
        await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ updatedUser });
};


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

    if(!(user && userToDelete.equals(userId))) {
        throw new ExpressError(401 , "Permission not granted to update this user.");
    }

    await User.findOneAndDelete({_id : userId , templeId : templeId });
    res.status(200).json("User delete Successfully.");
}