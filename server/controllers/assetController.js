const Asset = require("../models/assetsSchema");
const Tenant = require("../models/tenantSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createAsset = async(req ,res)=> {
    const templeId = req.params.templeId;
    const assetData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple ID is required.");
    }

    if(!assetData) {
        throw new ExpressError(404, "Plese provide valid data.");
    }

    const newAsset = new Asset({
        ...assetData,
        templeId : templeId,
    });

    await newAsset.save();

    res.status(200).json({ message : "Asset added successfully" });
}

module.exports.getAssets = async(req, res)=> {
    const templeId = req.params.templeId;
    const search = req.query.search

    if(!templeId) {
        throw new ExpressError(400, "Temple ID is required.");
    }

    let filters = { templeId };

    if(search) {
        const regex = new RegExp( search, 'i' );
        filters.$or = [
            { name : { $regex : regex }},
            { assetType : { $regex : regex } },
            { address: { $regex: regex } },
            { status: { $regex: regex } }
        ];
    }
    const assets = await Asset.find(filters).populate('rentDetails.tenant');

    res.status(200).json({ assets });
}

module.exports.addTenantToAsset = async (req, res) => {
    const { templeId, assetId } = req.params;
    const { tenant, rentAmount, leaseStartDate, leaseEndDate, paymentStatus } = req.body.rentDetails;

    // Validate required fields
    if (!tenant || !rentAmount || !leaseStartDate || !leaseEndDate || !paymentStatus) {
        throw new ExpressError(400, 'All fields are required');
    }

    // Validate templeId and assetId
    if (!templeId || !assetId) {
        throw new ExpressError(400, 'Temple ID and Asset ID are required');
    }

    // Fetch the asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
        throw new ExpressError(404, 'Asset not found');
    }

    // Check if the asset belongs to the temple
    if (asset.templeId.toString() !== templeId) {
        throw new ExpressError(403, 'Asset does not belong to the specified temple');
    }

    // Check if the asset already has a tenant
    if (asset.rentDetails.tenant) {
        throw new ExpressError(400, 'Asset already has a tenant');
    }

    // Validate tenant details
    const tenantExists = await Tenant.findById(tenant);
    if (!tenantExists) {
        throw new ExpressError(404, 'Tenant not found');
    }

    // Construct rentDetails object
    const rentDetails = {
        tenant: tenant,
        rentAmount: rentAmount,
        leaseStartDate: leaseStartDate,
        leaseEndDate: leaseEndDate,
        paymentStatus: paymentStatus
    };

    // Update asset with rentDetails
    asset.rentDetails = rentDetails;

    // Save the updated asset
    await asset.save();

    res.status(200).json({ message: 'Tenant added to asset successfully', asset });
};

module.exports.removeTenantFromAsset = async (req, res)=> {
    const { templeId, assetId } = req.params;

    // Validate templeId and assetId
    if (!templeId || !assetId) {
        throw new ExpressError(400, 'Temple ID and Asset ID are required');
    }

    // Fetch the asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
        throw new ExpressError(404, 'Asset not found');
    }

    // Check if the asset belongs to the temple
    if (asset.templeId.toString() !== templeId) {
        throw new ExpressError(403, 'Asset does not belong to the specified temple');
    }

    // Remove the tenant details
    asset.rentDetails = {
        tenant: null,
        rentAmount: null,
        leaseStartDate: null,
        leaseEndDate: null,
        paymentStatus: "Pending"
    };

    // Save the updated asset
    await asset.save();

    // Send a success response
    res.status(200).json({ message: 'Tenant removed successfully' });
}

module.exports.updateAsset = async (req, res) => {
    const { templeId, assetId } = req.params;
    const assetData = req.body;

    if (!templeId) {
        throw new ExpressError(400, "Temple ID is required.");
    }

    if (!assetId) {
        throw new ExpressError(400, "Asset ID is required.");
    }

    if (!assetData) {
        throw new ExpressError(404, "Please provide valid data.");
    }

    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new ExpressError(404, "Asset not found.");
    }

    if (asset.templeId.toString() !== templeId) {
        throw new ExpressError(403, "Asset does not belong to the specified temple.");
    }

    Object.keys(assetData).forEach(key => {
        asset[key] = assetData[key];
    });

    await asset.save();

    res.status(200).json({ message: "Asset updated successfully", asset });
};

module.exports.deleteAsset = async (req, res) => {
    const { templeId, assetId } = req.params;

    if (!templeId) {
        throw new ExpressError(400, "Temple ID is required.");
    }

    if (!assetId) {
        throw new ExpressError(400, "Asset ID is required.");
    }

    const asset = await Asset.findById(assetId);

    if (!asset) {
        throw new ExpressError(404, "Asset not found.");
    }

    if (asset.templeId.toString() !== templeId) {
        throw new ExpressError(403, "Asset does not belong to the specified temple.");
    }

    await Asset.findOneAndDelete({ _id : assetId, templeId : templeId });

    res.status(200).json({ message: "Asset deleted successfully" });
};