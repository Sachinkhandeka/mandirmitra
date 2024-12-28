const ExpressError = require("./utils/ExpressError");
const { 
    daanSchema, permissionSchema, roleSchema, superAdminSchema,
    templeGenInfo, templeGods, templeVideos, TempleFestivals,
    templePujaris, templeManagment, userSchema, expenseSchema, eventSchema, 
    invitationSchema, inventorySchema, tenantSchema, assetSchema, 
    devoteeSchema, postSchemaValidation, storySchemaValidation
} = require("./schemaValidation");

module.exports.validateDaanSchema = (req ,res ,next)=> {
    let { error } = daanSchema.validate(req.body.donation);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ;
            }).join(",");
            throw new ExpressError(400 , errMsg);
        } else {
            //if error is related to field validation 
            let errMsg = error.message ; 
            throw new ExpressError(400 , errMsg);
        }
    }
    next();
}

module.exports.validatePermissionSchema = (req, res, next) => {
    const templeId =  req.params.templeId ? req.params.templeId : req.body.templeId;

    const permission = {
        permissionName: req.body.formData ? req.body.formData.permissionName : req.body.permissionName,
        actions: req.body.formData ? req.body.formData.actions : req.body.actions,
        templeId: templeId,
    };

    let { error } = permissionSchema.validate(permission);

    if (error) {
        //if error is of joi but not related to field validation
        if (error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message;
            }).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            //if error is related to field validation
            let errMsg = error.message; 
            throw new ExpressError(400, errMsg);
        }
    }
    next();
}

//validate roleschema
module.exports.validateRoleSchema = (req ,res, next)=> {
    const  role = {
        name: req.body.name,
        permissions: req.body.permissions,
        templeId :  req.params.templeId,
    }
    let { error } = roleSchema.validate(role);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message;
            }).join(",");
            throw new ExpressError(400 , errMsg);
        }else {
            //if error is related to field validation
            let errMsg = error.message;
            throw new ExpressError(400, errMsg);
        }
    }
    next();
}

//validate superAdminschema
module.exports.validateSuperAdminSchema = (req ,res ,next)=> {
    let superAdmin = {}
    if(!req.body.templeId) {
        superAdmin = {
            username : req.body.username, 
            email : req.body.email,
            phoneNumber : req.body.phoneNumber, 
            password : req.body.password, 
            profilePicture : req.body.profilePicture,
            templeId : req.params.templeId, 
        }
    } else {
        superAdmin = req.body ; 
    }
    let { error } = superAdminSchema.validate(superAdmin);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");
            throw new ExpressError(400, errMsg);
        }else {
            //if error is related to field validation
            let errMsg = error.message;
            throw new ExpressError(400, errMsg);
        }
    }
    next();
}

//validate userschema
module.exports.validateDevoteeSchema = (req ,res ,next)=> {
    const devotee = req.body;
    let { error } = devoteeSchema.validate(devotee);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");

            throw new ExpressError(400 , errMsg);
        } else {
            //if error is related to field validation
            let erroMsg = error.message ; 
            throw new ExpressError(400, erroMsg);
        }

    }
    next();
}

//validate templeschema
module.exports.validateTempleSchema = (req, res, next) => {
    const templeSchemas = {
        genInfo: templeGenInfo,
        gods: templeGods,
        videos: templeVideos,
        festivals: TempleFestivals,
        pujaris: templePujaris,
        management: templeManagment,
    };

    const { type } = req.params;
    const templeData = req.body.templeData;
    const schema = templeSchemas[type];
    if (!schema) {
        throw new ExpressError(400, "Invalid type provided for temple data validation.");
    }

    const { error } = schema.validate(templeData);

    if (error) {
        if (error.isJoi) {
            const errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            throw new ExpressError(400, error.message);
        }
    }

    next();
};

//validate userschema
module.exports.validateUserSchema = (req ,res ,next)=> {
    const user =  {...req.body, templeId : req.params.templeId } ;
    let { error } = userSchema.validate(user);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");

            throw new ExpressError(400 , errMsg);
        } else {
            //if error is related to field validation
            let erroMsg = error.message ; 
            throw new ExpressError(400, erroMsg);
        }

    }
    next();
}

//validate expenseSchema
module.exports.validateExpenseSchema = (req ,res ,next)=> {
    const formData =  {...req.body, templeId : req.params.templeId } ;
    let { error } = expenseSchema.validate(formData);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");

            throw new ExpressError(400 , errMsg);
        } else {
            //if error is related to field validation
            let erroMsg = error.message ; 
            throw new ExpressError(400, erroMsg);
        }

    }
    next();
}

// validate eventSchema
module.exports.validateEventSchema = (req ,res ,next)=> {
    const eventData = {...req.body, templeId : req.params.templeId};
    let { error } = eventSchema.validate(eventData);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi)  {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");
            throw new ExpressError(400, errMsg);
        } else  {
            //if error is related to field validation
            let errMsg = error.message ;
            throw new ExpressError(400, errMsg)
        }
    }
    next();
}

// validate invitationSchema
module.exports.validateInvitationSchema = (req ,res ,next)=> {
    const invitation = {...req.body, temple : req.params.templeId , event : req.params.eventId};
    let { error } = invitationSchema.validate(invitation);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi)  {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");
            throw new ExpressError(400, errMsg);
        } else  {
            //if error is related to field validation
            let errMsg = error.message ;
            throw new ExpressError(400, errMsg)
        }
    }
    next();
}

// validate inventorySchema
module.exports.validateInventorySchema = (req ,res ,next)=> {
    const inventoryData = {...req.body, templeId : req.params.templeId};
    let { error } = inventorySchema.validate(inventoryData);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi)  {
            let errMsg = error.details.map(el => {
                return el.message ; 
            }).join(",");
            throw new ExpressError(400, errMsg);
        } else  {
            //if error is related to field validation
            let errMsg = error.message ;
            throw new ExpressError(400, errMsg)
        }
    }
    next();
}

//validate tenantSchema
module.exports.validateTenantSchema = (req, res, next) => {
    const tenantData = {...req.body, templeId: req.params.templeId};
    let { error } = tenantSchema.validate(tenantData);

    if (error) {
        if (error.isJoi) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            let errMsg = error.message;
            throw new ExpressError(400, errMsg);
        }
    }
    next();
};

//validate assetsSchema
module.exports.validateAssetSchema = (req, res, next) => {
    const assetData = {...req.body, templeId: req.params.templeId};
    let { error } = assetSchema.validate(assetData);

    if (error) {
        if (error.isJoi) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            let errMsg = error.message;
            throw new ExpressError(400, errMsg);
        }
    }
    next();
};

module.exports.validatePostSchema = (req, res, next)=> {
    const { post } = req.body;
    let { error } = postSchemaValidation.validate(post);

    if (error) {
        if (error.isJoi) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            let errMsg = error.message;
            throw new ExpressError(400, errMsg);
        }
    }
    next();
}

module.exports.validateStorySchema = (req ,res ,next)=> {
    let { error } = storySchemaValidation.validate(req.body.storyData);

    if(error) {
        //if error is of joi but not related to field validation
        if(error instanceof Error && error.isJoi) {
            let errMsg = error.details.map(el => {
                return el.message ;
            }).join(",");
            throw new ExpressError(400 , errMsg);
        } else {
            //if error is related to field validation 
            let errMsg = error.message ; 
            throw new ExpressError(400 , errMsg);
        }
    }
    next();
}