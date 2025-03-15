

const cloudinary = require("cloudinary").v2;

// Upload file to Cloudinary
exports.uploadOnCloudinary = async (file, folder_name, height, quality) => {
    try {
        const options = { folder: folder_name }; // Correct the option to `folder`

        if (height) {
            options.height = height;
        }

        if (quality) {
            options.quality = quality;
        }

        options.resource_type = "auto";

       
        if (!file.tempFilePath) {
            throw new Error("tempFilePath is not defined.");
        }

        const resp = await cloudinary.uploader.upload(file.tempFilePath, options);
        
        return resp;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw error;
    }
};

// Delete file from Cloudinary
exports.deleteFile = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        throw error;
    }
};
