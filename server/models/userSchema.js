const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError");

const userSchema =  new mongoose.Schema({
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
    profilePicture : {
        type : String,
        default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNChij9NGxfXhZQeEwg0TG9WAK6vm4vVm-e0EncJcCQ&s',
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken : {
        type : String,
    },
    roles : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Role"
    }]
},{ timestamps : true });

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcryptjs.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    try {
        // populating roles and permissions
        const userRoles = await this.populate({
            path : "roles",
            populate : {
                path : "permissions",
                model : "permission",
            }
        });

        //extracting permissions
        const permissions = userRoles.roles.flatMap( role => role.permissions.flatMap(permission => permission.actions) );
        return  jwt.sign(
            {
                _id : this._id,
                superAdmin : false,
                permissions,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY || '1d'
            }
        );
        
    } catch (error) {
        throw new ExpressError(401, "Error generating access token: " + error.message);
    }
}

userSchema.methods.generateRefreshToken = async function () {
    try {
        // populating roles and permissions
        const userRoles = await this.populate({
            path : "roles",
            populate : {
                path : "permissions",
                populate : "permission",
            }
        });

        //extracting permissions
        const permissions = userRoles.roles.flatMap(role => role.permissions.flatMap(permission => permission.actions));

        return jwt.sign(
            {
                _id : this._id,
                superAdmin : false,
                permissions,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : REFRESH_TOKEN_EXPIRY || '14d'
            }
        )
        
    } catch (error) {
        throw new ExpressError(401, "Error generating access token: " + error.message);
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User ; 