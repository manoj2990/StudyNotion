
// require('dotenv').config();

// const dbconnection = require('./configration/databaseConfigration')
// const {cloudinaryConnect} = require("../Backend/configration/cloudinaryConfigration");
// const app = require("./app");
// const {PORT} = require('./constant');


// cloudinaryConnect();
    
// dbconnection() 
// .then( ()=>(
//     app.listen( PORT || 5000 ,(req, res)=>(
//         console.log(`server is running at port :${PORT}`)
//     ))
    
// ))
// .catch( (error)=>(
//     console.log('App failed to listen due to DB connection failure:',error)
// ))


const { cloudinaryConnect } = require("../Backend/configration/cloudinaryConfigration");
const app = require("./app");
const { PORT } = require('./constant');

// Connect to Cloudinary and Database
cloudinaryConnect();

dbconnection()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.log('App failed to start due to DB connection failure:', error);
  });

// Export the app for Vercel serverless deployment
module.exports = app;
