const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    }
});

const Country = mongoose.model("Country", countrySchema);

const stateSchema = new mongoose.Schema({
    country : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Country",
    },
    name : {
        type : String,
        required : true,
    },
});

const State = mongoose.model("State", stateSchema);

const districtSchema = new mongoose.Schema({
    state : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "State",
    },
    name : {
        type : String,
        required : true,
    }
});
const District  = mongoose.model("District", districtSchema);

const tehsilSchema = new mongoose.Schema({
    district : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "District"
    },
    name : {
        type : String,
        required : true,
    }
});
const Tehsil = mongoose.model("Tehsil" , tehsilSchema);

const villageSchema = new mongoose.Schema({
    tehsil : {
        type : mongoose.Schema.Types.ObjectId,
        ref :  "Tehsil"
    },
    name : {
        type : String,
        required : true,
    }
});
const Village = mongoose.model("Village", villageSchema);

module.exports = { Country, State, District, Tehsil, Village }