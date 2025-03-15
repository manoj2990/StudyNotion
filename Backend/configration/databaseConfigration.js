 

 const {MONGODB_URI} = require('../constant');
 const mongoose = require("mongoose");
 
 require("dotenv").config();

 


  const dbconnection = async() =>{

    try {
        dbconnectionInstans = await mongoose.connect(`${MONGODB_URI}`);
        console.log(`MongoDB connected successfull...`)
    } catch (error) {
        console.log(`dbconnection is failed!!!`, error);
        process.exit(1);
    }

 }

 module.exports = dbconnection;