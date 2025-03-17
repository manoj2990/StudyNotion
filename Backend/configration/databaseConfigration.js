 

 require("dotenv").config();
 const mongoose = require("mongoose");
 

 


  const dbconnection = async() =>{

    try {
        console.log("MongoDB url -->", `${process.env.MONGODB_URI}`)
        dbconnectionInstans = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`MongoDB connected successfull...`)
    } catch (error) {
        console.log(`dbconnection is failed!!!`, error.message);
        process.exit(1);
    }

 }

 module.exports = dbconnection;