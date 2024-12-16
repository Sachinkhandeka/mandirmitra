const ExpressError = require("../utils/ExpressError");
const SuperAdmin = require("../models/superAdmin");
const User = require("../models/userSchema");
const Devotee = require("../models/devotee");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/nodeMailer");

// Helper function to find a user across all models
const findUserByEmail = async (email) => {
    // Search across all three models
    let user = await SuperAdmin.findOne({ email });
    if (user) return { user, model: "SuperAdmin" };

    user = await User.findOne({ email });
    if (user) return { user, model: "User" };

    user = await Devotee.findOne({ email });
    if (user) return { user, model: "Devotee" };

    // If no user is found, return null
    return null;
};

// Forgot Password Controller
module.exports.forgotPasswordController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ExpressError(401, "Please provide your email to proceed.");
    }

    // Find the user across all models
    const result = await findUserByEmail(email);
    if (!result) {
        throw new ExpressError(404, "No account found with this email address.");
    }

    const { user, model } = result;

    // Generate a JWT reset token with a 15-minute expiration
    const resetToken = jwt.sign(
        { 
            id: user._id, 
            email: user.email, 
            model 
        }, 
        process.env.RESET_TOKEN_SECRET, 
        {
            expiresIn: process.env.RESET_TOKEN_EXPIRY,
        });

    // Define the reset URL for production and development
    const resetURL =
        process.env.NODE_ENV === "production"
            ? `https://www.mandirmitra.co.in/reset-password/${resetToken}`
            : `http://localhost:5173/reset-password/${resetToken}`;

    // Send email to the user
    const mailOptions = {
        from: process.env.SMTP_SENDER_EMAIL,
        to: user.email,
        subject: "Password Reset Request for MandirMitra",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #FF5722;">MandirMitra Password Reset</h2>
                <p>Dear ${ model === 'Devotee' ? user.displayName : user.username || "User" },</p>
                <p>We received a request to reset the password for your MandirMitra account. You can reset your password using the link below. This link will expire in 15 minutes:</p>
                <a href="${resetURL}" style="display: inline-block; cursor: pointer; margin: 10px 0; padding: 10px 15px; background-color: #FF5722; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>If the above button doesn't work, copy and paste the following URL into your browser:</p>
                <p><a href="${resetURL}">${resetURL}</a></p>
                <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                <p>Best regards,</p>
                <p><strong>The MandirMitra Team</strong></p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
        message: "Password reset email sent successfully. Please check your email to proceed.",
    });
};

// Reset Password Controller
module.exports.resetPasswordController = async (req, res) => {
    const { token } = req.params; // The reset token sent via the email URL
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        throw new ExpressError(400, "Please provide both password and confirm password.");
    }

    if (password !== confirmPassword) {
        throw new ExpressError(400, "Passwords do not match.");
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    if(!decoded.id && !decoded.email && !decoded.model) {
        throw new ExpressError(400, "Invalid or expired password reset token.");
    }

    const { id, email, model } = decoded;

    // Dynamically fetch the user based on the model in the token payload
    let user;
    switch (model) {
        case "SuperAdmin":
            user = await SuperAdmin.findById(id);
            break;
        case "User":
            user = await User.findById(id);
            break;
        case "Devotee":
            user = await Devotee.findById(id);
            break;
        default:
            throw new ExpressError(400, "Invalid token payload.");
    }

    if (!user || user.email !== email) {
        throw new ExpressError(400, "Invalid or expired password reset token.");
    }

    user.password = password;
    await user.save();

    res.status(200).json({
        message: "Password reset successfully. You can now log in with your new password.",
        model
    });
};