if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const port = process.env.port || 8080 ; 
const app = express();
const mongoose = require("mongoose");
const DB_URL = process.env.MONGO_URL ; 
const cors = require("cors");
const path = require("path");

//importing routes 
const daanRoute = require("./routes/daan");

main().then(()=> {
    console.log("connection to mongo successfull!");
}).catch((err)=> {
    console.log(err);
});


async function main () {
    await mongoose.connect(DB_URL);
}

//helpfull middlewares 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

//routes 
app.use("/api/daan", daanRoute);

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