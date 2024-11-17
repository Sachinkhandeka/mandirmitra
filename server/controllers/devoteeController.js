const User = require("../models/userSchema");
const SuperAdmin = require("../models/superAdmin");
const Devotee = require("../models/devotee");
const ExpressError = require("../utils/ExpressError");

const generateAccessAndRefreshToken = async(devoteeId)=> {
    try {
        const devotee = await Devotee.findById(devoteeId);
        if(!devotee) {
            throw new ExpressError(401, "User not found");
        }

        const accessToken = await devotee.generateAccessToken();
        const refreshToken = await devotee.generateRefreshToken();
        devotee.refreshToken = refreshToken;
        await devotee.save({ validateBeforeSave : false });

        return { accessToken, refreshToken };
        
    } catch (error) {
        throw new ExpressError(500, "Something went wrong while generating tokens");
    }
}

// Controller for Devotee Authentication
module.exports.devoteeAuthController = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if(!(phoneNumber && password)) {
        throw new ExpressError(401, "Please provide your phone number and password");
    }
    // Check if user already exists in SuperAdmin or User collections
    let existingUser = await SuperAdmin.findOne({ phoneNumber });
    if (!existingUser) {
        existingUser = await User.findOne({ phoneNumber });
    }

    // If user exists in either SuperAdmin or User, prevent duplicate account creation
    if (existingUser) {
        return res.status(400).json({ message: "User with this phone number already exists." });
    }

    // Check if a devotee with this phone number already exists
    let existingDevotee = await Devotee.findOne({ phoneNumber });

    if(!existingDevotee) {
        return res.status(200).json({ needsSignup: true })
    }

    const isPassCorrect = await existingDevotee.isPasswordCorrect(password);

    if(!isPassCorrect) {
        throw new ExpressError(401, "Invalid Password");
    }

    const { accessToken, refreshToken } =  await generateAccessAndRefreshToken(existingDevotee._id);

    const loggedInDevotee = await Devotee.findById(existingDevotee._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res.status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json({ message : "User logged in successfully", currUser : loggedInDevotee, accessToken, refreshToken });
};

module.exports.devoteeCreateController = async (req, res) => {
    const devotee = req.body;
    // Extract fields from devotee object
    const { displayName, email, password, phoneNumber, photoURL } = devotee;

    try {
        // Validate that all required fields are provided
        if (!displayName || !email || !password || !phoneNumber) {
            throw new ExpressError(400, "All required fields (displayName, email, password, phoneNumber) must be provided.");
        }

        // Check if the email or phone number exists in User, SuperAdmin, or Devotee collections
        let existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        let existingAdmin = await SuperAdmin.findOne({ $or: [{ email }, { phoneNumber }] });
        let existingDevotee = await Devotee.findOne({ $or: [{ email }, { phoneNumber }] });

        if (existingUser || existingAdmin || existingDevotee) {
            throw new ExpressError(400, "A user with this email or phone number already exists.");
        }

        // Create new Devotee
        let newDevotee = new Devotee({
            displayName,
            email,
            phoneNumber,
            password,
            photoURL,
        });

        // Save Devotee
        newDevotee = await newDevotee.save();

        const registeredDevotee = await Devotee.findById(newDevotee._id).select("-password -refreshToken");

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newDevotee._id);
        const options = {
            httpOnly : true,
            secure : true,
        }
        return res.status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_Token", refreshToken, options)
        .json({ message : "User registered successfully", currUser : registeredDevotee });

    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error
            return res.status(400).json({ message: "Email or phone number already taken. Please try with a new one." });
        } else if (error instanceof ExpressError) {
            // Custom error handling
            return res.status(error.statusCode).json({ message: error.message });
        } else {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

// Controller for Editing Devotee Profile
module.exports.editDevoteeProfileController = async (req, res, next) => {
    const { devoteeId } = req.params;
    const devotee  = req.body ; 
    const { displayName, email, phoneNumber, photoURL } = devotee;

    try {
        // Check if devotee exists
        const existingDevotee = await Devotee.findById(devoteeId);
        if (!existingDevotee) {
            throw new ExpressError(404, "Devotee not found.");
        }

        // Check if email or phone number already exists in other users
        const duplicateUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        const duplicateAdmin = await SuperAdmin.findOne({ $or: [{ email }, { phoneNumber }] });
        const duplicateDevotee = await Devotee.findOne({
            $or: [{ email }, { phoneNumber }],
            _id: { $ne: devoteeId }, // Exclude current devotee's own data
        });

        if (duplicateUser || duplicateAdmin || duplicateDevotee) {
            throw new ExpressError(400, "Another user with this email or phone number already exists.");
        }

        // Update devotee fields
        existingDevotee.displayName = displayName || existingDevotee.displayName;
        existingDevotee.email = email || existingDevotee.email;
        existingDevotee.phoneNumber = phoneNumber || existingDevotee.phoneNumber;
        existingDevotee.photoURL = photoURL || existingDevotee.photoURL;

        // Save updated devotee profile
        const updatedDevotee = await existingDevotee.save();

        // Omit password from response
        const { password, refreshToken, ...rest } = updatedDevotee._doc;

        // Return updated profile data
        res.status(200).json({ currUser: rest, message: "Profile updated successfully!" });
    } catch (error) {
        throw new ExpressError(400, error.message);
    }
};

// Controller for Updating Password
module.exports.updatePasswordController = async (req, res, next) => {
    const { devoteeId } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        // Validate that new password meets minimum security requirements
        if (newPassword.length < 6) {
            throw new ExpressError(400, "New password must be at least 6 characters long.");
        }

        // Retrieve devotee by ID
        const existingDevotee = await Devotee.findById(devoteeId);
        if (!existingDevotee) {
            throw new ExpressError(404, "Devotee not found.");
        }

        // Verify old password
        const isMatch = await existingDevotee.isPasswordCorrect(oldPassword);
        if (!isMatch) {
            throw new ExpressError(400, "Incorrect old password.");
        }
        existingDevotee.password = newPassword ; 

        // Save the updated devotee profile
        await existingDevotee.save();

        // Send a success message
        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        if (error instanceof ExpressError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

//signout devotee
module.exports.signOutController = async(req,res)=> {
    await Devotee.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined,
            }
        },{ new : true });

        const options = {
            httpOnly : true,
            secure : true,
        }
    return res.status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json({ message : "User logged out successfully" });
}
