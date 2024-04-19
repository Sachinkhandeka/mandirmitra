const mongoose = require("mongoose");
const User = require("./userSchema");

const roleSchema = new mongoose.Schema({
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Temple',
    },
    name : {
        type : String,
        required : true,
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }],
}, { timestamps : true });

roleSchema.post("findOneAndDelete" , async(role)=> {
    const roleId =  role._id ; 

    await User.updateMany({ roles : roleId }, { $pull : { roles : roleId } } );
});

const Role = mongoose.model("Role", roleSchema);

module.exports =  Role  ;  