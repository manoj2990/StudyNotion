 

 const {MONGODB_URI} = require('../constant');
 const mongoose = require("mongoose");
 
 require("dotenv").config();

 


  const dbconnection = async() =>{

    try {
        console.log("MongoDB url -->", `${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        dbconnectionInstans = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected successfull...`)
    } catch (error) {
        console.log(`dbconnection is failed!!!`, error.message);
        process.exit(1);
    }

 }

 module.exports = dbconnection;