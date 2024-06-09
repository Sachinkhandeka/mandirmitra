const Seva = require("../models/sevaSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.create = async (req, res) => {
    const { templeId } = req.params;
    const { seva } = req.body;

    if (!templeId) {
        throw new ExpressError("Temple id required.");
    }

    if (!seva) {
        throw new ExpressError(400, "Invalid data format.");
    }

    const isSeva = await Seva.find({ temple: templeId, sevaName: seva });

    if (isSeva.length > 0) {
        throw new ExpressError(400, "Seva already exists.");
    }

    const newSeva = new Seva({
        temple: templeId,
        sevaName: seva,
    });

    await newSeva.save();

    res.status(200).json({ message: "Seva Created Successfully." });
};

module.exports.getSeva = async (req, res) => {
    const { templeId } = req.params;

    const searchCriteria = {
        temple: templeId,
    };

    const seva = await Seva.find(searchCriteria);

    res.status(200).json({ seva });
};

module.exports.editSeva = async (req, res) => {
    const { templeId, sevaId } = req.params;
    const { sevaName } = req.body;

    if (!templeId || !sevaId) {
        throw new ExpressError("Temple id and Seva id are required.");
    }

    if (!sevaName) {
        throw new ExpressError(400, "Invalid data format.");
    }

    const seva = await Seva.findOneAndUpdate(
        { _id: sevaId, temple: templeId },
        { sevaName },
        { new: true, runValidators: true }
    );

    if (!seva) {
        throw new ExpressError(404, "Seva not found.");
    }

    res.status(200).json({ message: "Seva Updated Successfully.", seva });
};

module.exports.deleteSeva = async (req, res) => {
    const { templeId, sevaId } = req.params;

    if (!templeId || !sevaId) {
        throw new ExpressError("Temple id and Seva id are required.");
    }

    const seva = await Seva.findOneAndDelete({ _id: sevaId, temple: templeId });

    if (!seva) {
        throw new ExpressError(404, "Seva not found.");
    }

    res.status(200).json({ message: "Seva Deleted Successfully." });
};
