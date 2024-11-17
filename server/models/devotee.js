const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const ExpressError = require("../utils/ExpressError");

const devoteeSchema = new mongoose.Schema({
    displayName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true,
    },
    phoneNumber : {
        type : String,
        required : true,
    },
    photoURL : {
        type : String,
        default : undefined,
    },
    refreshToken : {
        type : String,
    }
}, { timestamps : true });

devoteeSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    
    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

devoteeSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
}

devoteeSchema.methods.generateAccessToken = function() {
    try {
        return jwt.sign(
            {
                _id : this._id,
                displayName : this.displayName,
                devotee : true,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY || '1d'
            }
        )
    } catch (error) {
        throw new ExpressError(401, error.message);
    }
}

devoteeSchema.methods.generateRefreshToken = function() {
    try {
        return jwt.sign(
            {
                _id : this._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY || '14d'
            }
        )
    } catch (error) {
        throw new ExpressError(401, error.message);
    }
}

const Devotee = mongoose.model("Devotee", devoteeSchema );

module.exports = Devotee ; 