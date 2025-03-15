const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const sectionModel = require("../models/section.model");
const subSectionModel = require("../models/subSection.model");
const {uploadOnCloudinary} = require("../utils/cloudinaryUtils");
const FOLDER_NAME = require("../constant");


//createSubsection
exports.createSubsection = asyncHandler(async (req, res) => {

    try {
        // Extract necessary information from the request body
        const { sectionId, title, description } = req.body
        const video = req.files.video;

        
    
        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
          return res
            .status(404)
            .json(new ApiResponse(404, "All Fields are Required"))
        }

        console.log(video)
    
        // Upload the video file to Cloudinary
        const uploadDetails = await uploadOnCloudinary(
          video,
          FOLDER_NAME
        )

        console.log(uploadDetails)

        // Create a new sub-section with the necessary information
        const SubSectionDetails = await subSectionModel.create({
          title: title,
          timeDuration: `${uploadDetails.duration}`,
          description: description,
          videoUrl: uploadDetails.secure_url,
        })
    
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await sectionModel.findByIdAndUpdate(
          { _id: sectionId },
          { $push: { subSection: SubSectionDetails._id } },
          { new: true }
        ).populate("subSection")
    
        // Return the updated section in the response
        return res.status(200)
        .json( new ApiResponse(200, updatedSection  , "subsection created succesfully" ))
      } 
      catch (error) {
        // Handle any errors that may occur during the process
        console.error("Error creating new sub-section:", error)
        return res.ApiError(500, "Error creating new sub-section")
  
      }


});



//updateSubsection
exports.updateSubsection = asyncHandler(async (req, res) => {


    try {
        const { sectionId, subSectionId, title, description } = req.body

        if(!subSectionId || ! sectionId){
          return res.ApiError(404, "subSection & section id is required");
        }
        
        const subSection = await subSectionModel.findById(subSectionId)
    
        if (!subSection) {
         return res. ApiError(404, "SubSection not found")
        }
    

        if (title !== undefined) {
          subSection.title = title
        }
    

        if (description !== undefined) {
          subSection.description = description
        }

        if (req.files && req.files.video !== undefined) {
          const video = req.files.video
          const uploadDetails = await uploadOnCloudinary(
            video,
            FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        // find updated section and return it
        const updatedSection = await sectionModel.findById(sectionId).populate(
          "subSection"
        )
    
       
    
        return res.status(200)
        .json( new ApiResponse(200, updatedSection, "subSection updated successfully"));

      } 
      catch (error) {
        console.error(error)
        return res.ApiError(500, error.message || "An error occurred while updating the subsection");
      }


});


//deleteSubsection
exports.deleteSubsection = asyncHandler(async (req, res) => {

    try {
        const { subSectionId, sectionId } = req.body
        await sectionModel.findByIdAndUpdate(
          { _id: sectionId },
          {
            $pull: {
              subSection: subSectionId,
            },
          }
        )

        const subSection = await subSectionModel.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
          return res.ApiError(404, "SubSection not found")
        }
    
        // find updated section and return it
        const updatedSection = await sectionModel.findById(sectionId).populate(
          "subSection"
        )
    
        return res.status(200)
        .json( new ApiResponse(200, updatedSection,"SubSection deleted successfully" ));

      } 
      catch (error) {
        console.error(error)
        return res.ApiError(500, "An error occurred while deleting the SubSection")
      }

});



// getSubsectionDetails
exports.getSubsectionDetails = asyncHandler(async (req, res) => {
    const { sectionID } = req.params;

    if (!sectionID) {
        return res. ApiError(400, "Section ID is required.");
    }

    // Aggregate the Section and Subsection data
    const sectionDetails = await sectionModel.aggregate([
        // Match the section by ID
        {
            $match: { _id: mongoose.Types.ObjectId(sectionID) }
        },
        // Look up the subSections
        {
            $lookup: {
                from: "subsections", // The collection name for subSections (MongoDB automatically pluralizes the model name)
                localField: "subSection", // The field in Section model that contains references to Subsections
                foreignField: "_id", // The field in Subsection model to match the references
                as: "subSections" // Alias for the populated subSections
            }
        },
        // Optionally, project only the necessary fields (e.g., section name, and subsections with specific details)
        {
            $project: {
                sectionName: 1,
                subSections: {
                    title: 1,
                    description: 1,
                    timeDuration: 1,
                    videoUrl: 1
                }
            }
        }
    ]);

    // If the section is not found
    if (!sectionDetails || sectionDetails.length === 0) {
        return res. ApiError(404, "Section not found.");
    }

    // If you need to handle specific errors in subSections (like missing subSections), you can add additional logic
    const section = sectionDetails[0]; // Since we used $match on the sectionID, only one section will be returned

    return res.status(200).json(
        new ApiResponse(200, section, "Section and subsections fetched successfully.")
    );
});






