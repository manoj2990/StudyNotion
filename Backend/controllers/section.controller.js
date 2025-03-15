
const asyncHandler = require("../utils/asyncHandler");
const courseModel = require("../models/course.model");
// const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const sectionModel = require("../models/section.model");
const subSectionModel = require("../models/subSection.model");
const mongoose = require("mongoose");



// Create Section with Transaction
exports.createSection = asyncHandler(async (req, res) => {

    try {
        
        const { sectionName, courseId } = req.body
    
      
        if (!sectionName || !courseId) {
          return res.status(400).json({
            success: false,
            message: "Missing required properties",
          })
        }
    
       
        const newSection = await sectionModel.create({ sectionName })
    
       
        const updatedCourse = await courseModel.findByIdAndUpdate(
          courseId,
          {
            $push: {
                courseContent: newSection._id,
            },
          },
          { new: true }
        )
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        // Return the updated course object in the response
        res.status(200)
        .json( new ApiResponse(200 , updatedCourse, "Section created successfully"))
      }
       catch (error) {
        // Handle errors
        return res. ApiError(500, error.message )
      }
});



// Update Section with Transaction
exports.updateSection = asyncHandler(async (req, res) => {

    try {
        const { sectionName, sectionId, courseId } = req.body
        const section = await sectionModel.findByIdAndUpdate(
          sectionId,
          { sectionName },
          { new: true }
        )
        

        res.status(200).
        json( new ApiResponse(200 , section, "Section is updated succesfully"  ));

      } 
      catch (error) {
        console.error("Error updating section:", error)
       return res. ApiError( 500, error.message)
      }
   
});



// Delete Section
exports.deleteSection = asyncHandler(async (req, res) => {
    
    try {
    
        const { sectionId, courseId } = req.body;

        if(!sectionId || !courseId){
          return res.ApiError(400, "All feild are required");
        }

        await courseModel.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          },
        })


        const section = await sectionModel.findById(sectionId)

        console.log(sectionId, courseId)

        if (!section) {
          return res.status(404)
          .json( new ApiResponse(404, "section not found"))
        }


        // Delete the associated subsections
        await subSectionModel.deleteMany({ _id: { $in: section.subSection } })
    
        await sectionModel.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const updatedCourse = await courseModel.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
          return res.status(200)
          .json(new ApiResponse(200, updatedCourse, "Section deleted successfully."));
      
      }
       catch (error) {
        console.error("Error deleting section:", error)
       return res. ApiError(500, error.message);
      }

});




//getAllsectionDetails
exports.getAllSectionDetails = asyncHandler(async (req, res) => {
    const { courseID } = req.query;

    if (!courseID) {
        return res. ApiError(400, "Course ID is required.");
    }

    const course = await courseModel.findById(courseID).populate("courseContent");
    if (!course) {
        return res. ApiError(404, "Course not found.");
    }

    return res.status(200).json(new ApiResponse(200, course.courseContent, "Section details fetched successfully."));
});