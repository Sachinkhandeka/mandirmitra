const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");
const jwt = require("jsonwebtoken");

const superAdminSchema = new  mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    isAdmin : {
        type : Boolean,
        default : true,
    },
    profilePicture : {
        type : String,
        default : 'https://www.clipartmax.com/png/middle/82-820644_author-image-admin-icon.png',
    },
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken : {
        type : String,
    }
},{ timestamps : true });

superAdminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

superAdminSchema.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
}

superAdminSchema.generateAccessToken = function () {
    try {
        return jwt.sign(
            {
                _id : this._id,
                superAdmin : true
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY || '1d'
            }
        );
        
    } catch (error) {
        throw new ExpressError(401, "Error generating access token: " + error.message)
    }
}

superAdminSchema.generateRefreshToken = function () {
    try {
        return jwt.sign(
            {
                _id : this._id,
                superAdmin : true
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY || '14d'
            }
        )
        
    } catch (error) {
        throw new ExpressError(401, "Error generating access token: " + error.message);
    }
}

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin ; 