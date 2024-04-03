const ExpressError = require("./utils/ExpressError");
const { daanSchema } = require("./schemaValidation");

module.exports.validateDaanSchema = (req ,res ,next)=> {
    let { error } = daanSchema.validate(req.body);

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