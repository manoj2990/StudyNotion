
require("dotenv").config();
const app = require("./app");
const { cloudinaryConnect } = require("../Backend/configration/cloudinaryConfigration");
const dbconnection = require('./configration/databaseConfigration');

// Connect to Cloudinary and Database
cloudinaryConnect();

dbconnection()
  .then(() => {
    console.log('Database connected successfully');

    // Start the server after a successful database connection
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });

  })
  .catch((error) => {
    console.log('App failed to start due to DB connection failure:', error);
  });

// Export the app for Vercel serverless deployment
module.exports = app;
