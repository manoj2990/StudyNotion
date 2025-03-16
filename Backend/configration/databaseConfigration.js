 

 const {MONGODB_URI} = require('../constant');
 const mongoose = require("mongoose");
 
 require("dotenv").config();

 


  const dbconnection = async() =>{

    try {
        console.log("MongoDB url -->", `${MONGODB_URI}`)
        dbconnectionInstans = await mongoose.connect(`${MONGODB_URI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log(`MongoDB connected successfull...`)
    } catch (error) {
        console.log(`dbconnection is failed!!!`, error.message);
        process.exit(1);
    }

 }

 module.exports = dbconnection;