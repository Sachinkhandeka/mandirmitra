const User = require("../models/userSchema");
const SuperAdmin = require("../models/superAdmin");
const Devotee = require("../models/devotee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");

const saltRounds = 10;
const secret = process.env.JWT_SECRET;

// Controller for Devotee Authentication
module.exports.devoteeAuthController = async (req, res, next) => {
    const { phoneNumber } = req.body;

    try {
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

        if (existingDevotee) {
            // If the devotee exists, log them in by generating a JWT token
            const payload = {
                id: existingDevotee._id,
                devotee: true,
            };

            const token = jwt.sign(payload, secret, { expiresIn: "7d" });

            // Omit password from response
            const { password, ...rest } = existingDevotee._doc;

            // Return response with token and user data
            return res.status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json({ currUser: rest });
        } else {
            // If devotee does not exist, return a response indicating they need to sign up
            return res.status(200).json({ needsSignup: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.devoteeCreateController = async (req, res, next) => {
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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new Devotee
        let newDevotee = new Devotee({
            displayName,
            email,
            phoneNumber,
            password: hashedPassword,
            photoURL,
        });

        // Save Devotee
        newDevotee = await newDevotee.save();

        // Generate JWT token for the new Devotee
        const token = jwt.sign({ id: newDevotee._id, devotee: true }, secret, { expiresIn: '7d' });

        // Omit password from response
        const { password: pass, ...rest } = newDevotee._doc;

        // Set token in cookie and send response
        res.status(201).cookie("access_token", token, { httpOnly: true }).json({
            currUser: rest,
        });
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
        const { password, ...rest } = updatedDevotee._doc;

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
        const isMatch = await bcrypt.compare(oldPassword, existingDevotee.password);
        if (!isMatch) {
            throw new ExpressError(400, "Incorrect old password.");
        }

        // Hash and set the new password
        existingDevotee.password = await bcrypt.hash(newPassword, saltRounds);

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
    res.clearCookie('access_token').status(200).json('User signout successfully.');
}
