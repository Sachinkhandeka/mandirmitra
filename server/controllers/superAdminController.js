const ExpressError = require("../utils/ExpressError");
const Temple  = require("../models/temple");
const SuperAdmin = require("../models/superAdmin");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (userId, userType) => {
    try {
        // Dynamically determine the model based on userType
        const user = userType === "Admin" 
            ? await SuperAdmin.findById(userId) 
            : await User.findById(userId).populate({
                path: "roles",
                populate: {
                    path: "permissions",
                    model: "Permission",
                },
            });
        if (!user) {
            throw new ExpressError(401, "User not found");
        }

        // Generate tokens using schema methods
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ExpressError(500, "Error generating tokens: " + error.message);
    }
};

module.exports.singinWithPhoneNumber = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!(phoneNumber && password)) {
        throw new ExpressError(401, "Please provide phone number and password");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    // Check for SuperAdmin first, then fall back to User
    let existingUser = await SuperAdmin.findOne({ phoneNumber }) || 
                       await User.findOne({ phoneNumber });

    if (!existingUser) {
        return res.status(200).json({ needsSignup: true });
    }

    // Check password validity
    const isPassCorrect = await existingUser.isPasswordCorrect(password);
    if (!isPassCorrect) {
        throw new ExpressError(401, "Invalid user credentials");
    }

    // Determine user type
    const userType = existingUser instanceof SuperAdmin ? "Admin" : "User";

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id, userType);

    // Remove sensitive data (like refreshToken and password) before sending response
    const { password: pass, refreshToken: rt, ...rest } = existingUser._doc;

    return res
        .status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json({ message: "User logged in successfully", currUser: rest, accessToken, refreshToken });
};

//create route handler
module.exports.createController = async (req, res) => {
    const { templeId, username, email, password, phoneNumber } = req.body;
    const options = {
        httpOnly: true,
        secure: true,
    };

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

    // Create and save the SuperAdmin
    const superAdmin = new SuperAdmin({
        username,
        email,
        templeId: temple._id,
        phoneNumber,
        password, 
    });

    await superAdmin.save();

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(superAdmin._id, "Admin");

    // Save the refresh token to the database
    superAdmin.refreshToken = refreshToken;
    await superAdmin.save();

    // Omit sensitive data
    const { password: pass, refreshToken: rt, ...rest } = superAdmin._doc;

    res.status(201)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json({ 
            message : "Admin created/loggedin successfully",
            currUser: rest, accessToken, refreshToken 
        });
};


//signin route handler
module.exports.signinController = async (req, res) => {
    const { email, password } = req.body;

    const options = {
        httpOnly: true,
        secure: true,
    };

    if (!(email && password)) {
        throw new ExpressError(400, "User credentials is required");
    }

    // Find the SuperAdmin by email
    const superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
        throw new ExpressError(404, "Invalid user credentials");
    }

    // Validate the password
    const isPassCorrect = await superAdmin.isPasswordCorrect(password);
    if (!isPassCorrect) {
        throw new ExpressError(400, "Invalid user credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(superAdmin._id, "Admin");

    // Save the refresh token to the database
    superAdmin.refreshToken = refreshToken;
    await superAdmin.save();

    // Omit sensitive data
    const { password: pass, refreshToken: rt, ...rest } = superAdmin._doc;

    res.status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json({
            message : "Admin logged in successfully", 
            currUser: rest , accessToken, refreshToken
        });
};


//google auth route handler
module.exports.googleController = async (req, res) => {
    const { email, name, googlePhotoUrl, phoneNumber, templeId } = req.body;
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Check if the SuperAdmin already exists
    let superAdmin = await SuperAdmin.findOne({ email });

    if (superAdmin) {
        // Existing SuperAdmin: Generate tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(superAdmin._id, "Admin");

        // Save the refresh token to the database
        superAdmin.refreshToken = refreshToken;
        await superAdmin.save();

        const { password: pass, refreshToken: rt, ...rest } = superAdmin._doc;

        return res.status(200)
            .cookie("access_token", accessToken, options)
            .cookie("refresh_token", refreshToken, options)
            .json({ 
                message : "Admin logged in successfully",
                currUser: rest, accessToken, refreshToken
            });
    }

    // If not found, create a new SuperAdmin
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    const existingAdmin = await SuperAdmin.findOne({ templeId });
    if (existingAdmin) {
        throw new ExpressError(400, "A super admin already exists for this temple");
    }

    // Generate a random password for the new SuperAdmin
    const genRandomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    superAdmin = new SuperAdmin({
        username: name.trim().split(" ").join("").toLowerCase() + Math.random().toString(4).slice(-3),
        email,
        profilePicture: googlePhotoUrl,
        phoneNumber,
        templeId: temple._id,
        password: genRandomPass,
    });

    await superAdmin.save();

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(superAdmin._id, "Admin");

    // Save the refresh token to the database
    superAdmin.refreshToken = refreshToken;
    await superAdmin.save();

    const { password: pass, refreshToken: rt, ...rest } = superAdmin._doc;

    res.status(201)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json({
            message : "Admin logged in successfully",
            currUser: rest, accessToken, refreshToken, 
        });
};


//edit superAdmin rooute handler
// Edit SuperAdmin route handler
module.exports.editController = async (req, res) => {
    const user = req.user; // Logged-in user
    const { username, email, phoneNumber, password, profilePicture } = req.body;
    const { templeId, id } = req.params;

    // Ensure the logged-in user has permissions to edit this SuperAdmin
    if (user.id !== id && !templeId) {
        throw new ExpressError(403, "You are not allowed to update this user.");
    }

    // Find the SuperAdmin by ID and Temple ID
    const isSuperAdmin = await SuperAdmin.findOne({ _id: id, templeId });
    if (!isSuperAdmin) {
        throw new ExpressError(404, "SuperAdmin not found.");
    }

    // Update fields only if provided in the request and different from existing values
    if (username && username !== isSuperAdmin.username) isSuperAdmin.username = username;
    if (email && email !== isSuperAdmin.email) isSuperAdmin.email = email;
    if (phoneNumber && phoneNumber !== isSuperAdmin.phoneNumber) isSuperAdmin.phoneNumber = phoneNumber;
    if (password) isSuperAdmin.password = password; 
    if (profilePicture && profilePicture !== isSuperAdmin.profilePicture) isSuperAdmin.profilePicture = profilePicture;

    await isSuperAdmin.save();

    const { password: pass, refreshToken, ...rest } = isSuperAdmin._doc;
    res.status(200).json({ currUser: rest });
};

//signout route handler
module.exports.signoutController = async (req ,res)=> {
    await SuperAdmin.findByIdAndUpdate(
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
    .json({ message : "Admin logged out successfully" });
}

module.exports.refreshTokenController = async (req, res) => {
    const incomingRefreshToken = req.cookies.refresh_token;

    if (!incomingRefreshToken) {
        throw new ExpressError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ExpressError(401, "Invalid or expired refresh token");
    }

    let user, userType;

    if (decodedToken.superAdmin) {
        // Check if the token belongs to a SuperAdmin
        user = await SuperAdmin.findById(decodedToken._id);
        userType = "Admin"; // Set user type for token generation
    } else {
        // If not a SuperAdmin, check for a regular User
        user = await User.findById(decodedToken._id);
        if (user && user.refreshToken === incomingRefreshToken) {
            userType = "User"; // Set user type for token generation
        }
    }
    // If no valid user is found
    if (!user || user.refreshToken !== incomingRefreshToken) {
        throw new ExpressError(401, "Refresh token expired or invalid");
    }

    // Generate new tokens
    const options = {
        httpOnly: true,
        secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id, userType);

    return res
        .status(200)
        .cookie("access_token", accessToken, options)
        .cookie("refresh_token", refreshToken, options)
        .json({
            message: "Access token refreshed successfully",
            accessToken,
            refreshToken,
        });
};
