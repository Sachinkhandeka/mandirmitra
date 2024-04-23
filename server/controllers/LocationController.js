const ExpressError = require("../utils/ExpressError");
const { Country, State, District, Tehsil, Village } = require("../models/Location");

module.exports.addController = async (req, res) => {
        const formData = req.body;

        // Check if any location field is provided in the form data
        if (!formData || Object.keys(formData).length === 0) {
            throw new ExpressError(400, "Please provide at least one field.");
        }

        let country, state, district, tehsil, village;

        // Check if country exists or create a new one
        if (formData.country) {
            country = await Country.findOne({ name: formData.country });
            if (!country) {
                country = await Country.create({ name: formData.country });
            }
        }

        // Check if state exists or create a new one
        if (formData.state) {
            state = await State.findOne({ name: formData.state, country: country ? country._id : null });
            if (!state) {
                state = await State.create({ name: formData.state, country: country ? country._id : null });
            }
        }

        // Check if district exists or create a new one
        if (formData.district) {
            district = await District.findOne({ name: formData.district, state: state ? state._id : null });
            if (!district) {
                district = await District.create({ name: formData.district, state: state ? state._id : null });
            }
        }

        // Check if tehsil exists or create a new one
        if (formData.tehsil) {
            tehsil = await Tehsil.findOne({ name: formData.tehsil, district: district ? district._id : null });
            if (!tehsil) {
                tehsil = await Tehsil.create({ name: formData.tehsil, district: district ? district._id : null });
            }
        }

        // Check if village exists or create a new one
        if (formData.village) {
            village = await Village.findOne({ name: formData.village, tehsil: tehsil ? tehsil._id : null });
            if (!village) {
                village = await Village.create({ name: formData.village, tehsil: tehsil ? tehsil._id : null });
            }else {
                throw new ExpressError(400 , "Village with this name already created.");
            }
        }

        res.status(200).json({
            message : "Location added successfully.",
        });
}
