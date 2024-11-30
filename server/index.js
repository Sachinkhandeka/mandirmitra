if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const port = process.env.port || 8080 ; 
const app = express();
const mongoose = require("mongoose");
const DB_URL = process.env.MONGO_URL ; 
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//importing routes 
const templeRoute = require("./routes/temple");
const superAdminRoute = require("./routes/superAdmin");
const daanRoute = require("./routes/daan");
const userRoute = require("./routes/user");
const roleRoute = require("./routes/role");
const permissionRoute = require("./routes/permission");
const locationRoute = require("./routes/location");
const expenseRoute = require("./routes/expense");
const eventRoute = require("./routes/event");
const invitationRoute = require("./routes/invitation");
const sevaRoute = require("./routes/seva");
const inventoryRoute = require("./routes/inventory");
const tenantRoute = require("./routes/tenant");
const assetRoute = require("./routes/asset");
const devoteeRoute = require("./routes/devotee");
const postRoute = require("./routes/post");

main().then(()=> {
    console.log("connection to mongo successfull!");
}).catch((err)=> {
    console.log(err);
});


async function main () {
    await mongoose.connect(DB_URL);
}

//helpfull middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

//routes 
app.use( "/api/temple", templeRoute );
app.use( "/api/superadmin", superAdminRoute );
app.use( "/api/user", userRoute );
app.use( "/api/donation", daanRoute );
app.use( "/api/role", roleRoute );
app.use( "/api/permission", permissionRoute );
app.use( "/api/location", locationRoute );
app.use( "/api/expense", expenseRoute );
app.use( "/api/event", eventRoute );
app.use( "/api/invitation", invitationRoute );
app.use( "/api/seva", sevaRoute );
app.use( "/api/inventory", inventoryRoute );
app.use( "/api/tenant", tenantRoute );
app.use( "/api/asset", assetRoute );
app.use( "/api/devotee", devoteeRoute );
app.use( "/api/post", postRoute );


//static folder for client side pages 
app.use(express.static((path.join(__dirname , '../client/dist'))));

//route that does not matches any of the above rote will handled here 
app.all("*" , (req ,res)=> {
    res.sendFile(path.join(__dirname , "../client/dist" , "index.html"));
});

//error handling middleware 
app.use((err ,req ,res ,next)=> {
    let { status = 500 , message = "Some Error Occured" } = err ; 
    res.status(status).json({
        success : false,
        statusCode : status,
        message: message,
    });
});

app.listen(port , ()=> {
    console.log(`port is  running on port number ${port}`);
});