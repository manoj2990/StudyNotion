
const {
    CLOUDINARY_CLOUD_NAME ,
    CLOUDINARY_API_KEY, 
    CLOUDINARY_API_SECRET } = require("../constant");

const cloudinary = require("cloudinary").v2;


exports.cloudinaryConnect = () => {
   
    try {
       
        cloudinary.config({
            cloud_name: `${CLOUDINARY_CLOUD_NAME}`,
            api_key: `${CLOUDINARY_API_KEY}`,
            api_secret: `${CLOUDINARY_API_SECRET}`,
        });
        console.log("Connection successfull with cloudiary.")
    } catch (err) {
        console.log(err);
        console.log("Could not connect to cloudinary.");
    }
};