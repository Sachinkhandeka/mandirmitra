const ExpressError = require("../utils/ExpressError");
const { Country, State, District, Tehsil, Village } = require("../models/Location");

module.exports.addController = async (req, res) => {
        const formData = req.body;
        const templeId = req.params.templeId ;

        //check if templeIdd present or not
        if(!templeId) {
            throw new ExpressError(400, "Connot add location without templeId");
        }

        // Check if any location field is provided in the form data
        if (!formData || Object.keys(formData).length === 0) {
            throw new ExpressError(400, "Please provide at least one field.");
        }

        let country, state, district, tehsil, village;

        // Check if country exists or create a new one
        if (formData.country) {
            country = await Country.findOne({ name: formData.country, temple : templeId });
            if (!country) {
                country = await Country.create({ name: formData.country, temple : templeId });
            }
        }

        // Check if state exists or create a new one
        if (formData.state) {
            state = await State.findOne({ name: formData.state, country: country ? country._id : null, temple:templeId });
            if (!state) {
                state = await State.create({ name: formData.state, country: country ? country._id : null, temple: templeId });
            }
        }

        // Check if district exists or create a new one
        if (formData.district) {
            district = await District.findOne({ name: formData.district, state: state ? state._id : null, temple:templeId });
            if (!district) {
                district = await District.create({ name: formData.district, state: state ? state._id : null, temple:templeId });
            }
        }

        // Check if tehsil exists or create a new one
        if (formData.tehsil) {
            tehsil = await Tehsil.findOne({ name: formData.tehsil, district: district ? district._id : null, temple:templeId });
            if (!tehsil) {
                tehsil = await Tehsil.create({ name: formData.tehsil, district: district ? district._id : null, temple : templeId });
            }
        }

        // Check if village exists or create a new one
        if (formData.village) {
            village = await Village.findOne({ name: formData.village, tehsil: tehsil ? tehsil._id : null, temple: templeId });
            if (!village) {
                village = await Village.create({ name: formData.village, tehsil: tehsil ? tehsil._id : null, temple: templeId });
            }else {
                throw new ExpressError(400 , "Village with this name already created.");
            }
        }

        res.status(200).json({
            message : "Location added successfully.",
        });
}

//get route handler for country
module.exports.getAllCountry = async(req ,res)=> {
    const { templeId } = req.params ; 
    const countries= await Country.find({temple : templeId});
    if (!countries) {
        throw new ExpressError(404, "Countries not found.");
    }
    res.status(200).json({ countries });
}

//get route handler for states
module.exports.getStatesByCountry = async (req, res) => {
    const { templeId, countryId } = req.params;
    const states = await State.find({ country: countryId, temple: templeId });
    if (!states) {
        throw new ExpressError(404, "States not found for the provided country.");
    }
    res.status(200).json({ states });
};

//get route handler for districts
module.exports.getDistrictsByState = async (req, res) => {
    const { templeId, stateId } = req.params;
    const districts = await District.find({ state: stateId, temple : templeId });
    if (!districts) {
        throw new ExpressError(404, "Districts not found for the provided state.");
    }
    res.status(200).json({ districts });
};

//get route handler for tehsils
module.exports.getTehsilsByDistrict = async (req, res) => {
    const { templeId, districtId } = req.params;
    const tehsils = await Tehsil.find({ district: districtId, temple: templeId });
    if (!tehsils) {
        throw new ExpressError(404, "Tehsils not found for the provided district.");
    }
    res.status(200).json({ tehsils });
};

//get rounte handler for villages
module.exports.getVillagesByTehsil = async (req, res) => {
    const { templeId, tehsilId } = req.params;
    const villages = await Village.find({ tehsil: tehsilId, temple : templeId });
    if (!villages) {
        throw new ExpressError(404, "Villages not found for the provided tehsil.");
    }
    res.status(200).json({ villages });
};

//get rounte handler for all 
module.exports.getAllController = async(req ,res)=> {
    const templeId = req.params.templeId ; 

    if(!templeId) {
        throw new ExpressError(400, "Connot get address data.");
    }

    //get village
    const villages = await Village.find({temple : templeId});
    //get tehsils
    const tehsils = await Tehsil.find({temple : templeId});
    //get districts
    const  districts = await District.find({temple: templeId});
    //get state
    const states = await State.find({temple : templeId});
    //get country
    const countries = await Country.find({temple : templeId});

    if(!villages || !tehsils || !districts || !states || !countries) {
        throw new ExpressError(400, "Some error occured while fetchin data.");
    }

    res.status(200).json({
        villages,
        tehsils,
        districts,
        states,
        countries,
    });
}