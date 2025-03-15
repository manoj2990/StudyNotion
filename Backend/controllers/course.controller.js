
const courseModel = require("../models/course.model");
const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
const courseProgressModal = require("../models/courseProgress.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { uploadOnCloudinary } = require("../utils/cloudinaryUtils");
const { FOLDER_NAME } = require("../constant");
const sectionModel = require("../models/section.model")
const subSectionModel = require("../models/subSection.model");
const mongoose = require("mongoose")
const {convertSecondsToDuration} = require('../utils/secToDuration');





// Create Course
exports.createCourse = asyncHandler(async (req, res) => {
    const { 
        courseName, 
        courseDescription, 
        whatYouWillLearn, 
        price, 
        tag,
        category,
		instructions,
    } = req.body;

    let {status } = req.body;

    const thumbnailImage = req.files.thumbnailImage || {};

    // Validate required fields
    if (
      !courseName || 
      !courseDescription || 
      !whatYouWillLearn || 
      !price || 
      !tag ||
      !category || 
      !thumbnailImage) 
    {
        return res. ApiError(400, "All fields are required, including thumbnail image.");
    }

    
    if (!status || status === undefined) {
			status = "Draft";
		}

    // Check if the user is an instructor
    const instructorDetails = await userModel.findById(req.user?._id,
      {accountType: "Instructor"}
    );
   

    if (!instructorDetails) {
        return res. ApiError(404, "Instructor details not found.");
    }

    // Validate Tag
    const categoryDetails = await categoryModel.findById({_id:category});
    if (!categoryDetails) {
        return res. ApiError(404, "categoryDetails not found.");
    }
    

    // Upload Thumbnail Image to Cloudinary
    const cloudinaryResponse =  await uploadOnCloudinary(thumbnailImage, FOLDER_NAME);
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
        return res. ApiError(500, "Error occurred during image upload.");
    }

    // Create New Course
    const newCourse = await courseModel.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn,
        price,
        tag: tag,
        category: categoryDetails._id,
        thumbnail: cloudinaryResponse.secure_url,
        status: status,
		instructions: instructions,
    });

    if (!newCourse) {
        throw new ApiError(500, "Failed to create the course.");
    }
     
    

   	// Add the new course to the User Schema of the Instructor
    await userModel.findByIdAndUpdate(
        instructorDetails._id,
        { $push: { courses: newCourse._id } },
        { new: true }
    );

    

    // Add the new course to the Categories
    await categoryModel.findByIdAndUpdate(
      categoryDetails._id,
        { $push: { courses: newCourse._id } },
        { new: true }
    );

    
    // Success Response
    return res.status(200).json(
        new ApiResponse(200,newCourse,"Course created successfully")
    );
});


//editCoures
exports.editCourse = asyncHandler(async (req, res) => {
    try {
        
      const { courseId, ...updates } = req.body; // Destructure courseId and updates
     
      // Validate courseId
      if (!courseId) {
        return res. ApiError(400, "Course ID is required");
      }
  
      // Fetch the course by ID
      const course = await courseModel.findById(courseId);
      if (!course) {
        return res. ApiError(404, "Course not found");
      }
  
      // Handle thumbnail image update if provided
      if (req.files && req.files.thumbnailImage) {
        const thumbnail = req.files.thumbnailImage;
  
        // Validate thumbnail file type
        if (!thumbnail.mimetype.startsWith("image/")) {
          return res. ApiError(400, "Invalid file type for thumbnail image");
        }
  
        // Upload thumbnail to Cloudinary
        const uploadedThumbnail = await uploadOnCloudinary(thumbnail, FOLDER_NAME);
        course.thumbnail = uploadedThumbnail.secure_url;
      }
  
      // Update only the fields present in the request body
      Object.keys(updates).forEach((key) => {
        if (["tag", "instructions"].includes(key)) {
          try {
            course[key] = JSON.parse(updates[key]); // Parse JSON fields
          } catch (error) {
            return res. ApiError(400, `Invalid JSON format for ${key}`);
          }
        } else if (key !== "thumbnailImage") {
          // Avoid overwriting non-updatable fields
          course[key] = updates[key];
        }
      });
  
      // Save the updated course
      await course.save();
  
      // Populate necessary fields for the updated course
      const updatedCourse = await courseModel
        .findById(courseId)
        .populate({
          path: "instructor",
          populate: { path: "additionalDetails" },
        })
        .populate("category")
        .populate("ratingAndreviews") // ratingAndreviews --> feild name hian
        .populate({
          path: "courseContent",
          populate: { path: "subSection" },
        })
        .exec();

        

        
  
      // Return success response
      return res
        .status(200)
        .json(new ApiResponse(200,updatedCourse, "Course updated successfully" ));
    } catch (error) {
      // Log error for debugging
      console.error("Error updating course:", error);
  
      // Handle known errors or fallback to generic error
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json(new ApiResponse(error.statusCode, error.message));
      }
  
      // Fallback for unexpected errors
      return res
        .status(500)
        .json(new ApiResponse(500, "Internal server error", { error: error.message }));
    }
  });


// deleteCourse
exports.deleteCourse = asyncHandler(async (req, res) => {
    
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { courseId } = req.body;
  
      // Validate courseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.ApiError(400, "Invalid course ID")
      }
  
      // Check if the course exists
      const course = await courseModel.findById(courseId).session(session);
      if (!course) {
        return res.ApiError(400, "Course not found" )
      }
  
      // Unenroll all students from the course
      const studentsEnrolled = course.studentsEnrolled;
      if (studentsEnrolled.length > 0) {
        await userModel.updateMany(
          { _id: { $in: studentsEnrolled } },
          { $pull: { courses: courseId } },
          { session }
        );
      }
  
      // Delete all sections and their subsections
      const courseSections = course.courseContent;
      if (courseSections.length > 0) {
        // Fetch all sections to get their subsections
        const sections = await sectionModel.find({ _id: { $in: courseSections } }).session(session);
  
        const allSubSectionIds = sections.reduce((acc, section) => {
          return acc.concat(section.subSection);
        }, []);
  
        // Delete all subsections
        if (allSubSectionIds.length > 0) {
          await subSectionModel.deleteMany({ _id: { $in: allSubSectionIds } }).session(session);
        }
  
        // Delete all sections
        await sectionModel.deleteMany({ _id: { $in: courseSections } }).session(session);
      }
  
      // Delete the course
      await courseModel.findByIdAndDelete(courseId).session(session);
  
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
  
      return res.status(200).json({
        success: true,
        message: `Course "${course.title}" deleted successfully`,
      });
    } catch (error) {
      // Rollback transaction in case of error
      await session.abortTransaction();
      session.endSession();
      console.error("Error deleting course:", error);
      return res.ApiError(500, "Failed to delete course. Please try again later.", error.message)
    }
  });
  

// show All Courses
exports.ShowAllCourses = asyncHandler(async (req, res) => {

  
    const getAllCoursesPipeline = [
        {
            $lookup: {
                from: "users", // Join with the User collection
                localField: "instructor",
                foreignField: "_id",
                as: "instructorDetails"
            }
        },
        {
            $unwind: "$instructorDetails" // Convert instructorDetails array to an object
        },
        {
            $lookup: {
                from: "users", // Join with the User collection for enrolled students
                localField: "studentsEnrolled",
                foreignField: "_id",
                as: "studentsDetails"
            }
        },
        {
            $lookup: {
                from: "ratingandreviews", // Join with the RatingAndReviews collection
                localField: "ratingAndreviews",
                foreignField: "_id",
                as: "ratings"
            }
        },
        {
            $project: {
                courseName: 1,
                courseDescription: 1,
                "instructorDetails.firstName": 1,
                "instructorDetails.lastName": 1,
                "instructorDetails.email": 1,
                studentsDetails: 1, // Include entire array for studentsDetails
                ratings: 1,
                price: 1,
                thumbnail: 1,
                whatYouWillLearn: 1
            }
        }
    ];

  
    const allCourses = await courseModel.aggregate(getAllCoursesPipeline); // Execute the pipeline

    if (!allCourses || allCourses.length === 0) {
        return res.ApiError(404, "No courses found.");
    }

    return res.status(200).json(
        new ApiResponse(200, allCourses, "All courses fetched successfully")
    );
});




// Get Single Course Details
exports.getSpecificCourseDetails = asyncHandler ( async (req, res) => {
 
    const { courseId } = req.body;
    const userId = req.user?._id // Get courseId from request params
  
    // Validate if courseId is provided
    if (!courseId) {
        return res. ApiError(400, "Course ID is required.");
    }

    // Define aggregation pipeline to get course details
    const courseDetailsPipeline = [
        {
            $match: { _id: new mongoose.Types.ObjectId(courseId) }, // Match course by ID
        },
        {
            $lookup: {
                from: "users", // Get instructor details
                localField: "instructor",
                foreignField: "_id",
                as: "instructorDetails",
                pipeline: [
                    {
                        $lookup: {
                            from: "profiles", // Get additional details for instructor
                            localField: "additionalDetails",
                            foreignField: "_id",
                            as: "additionalDetails",
                        },
                    },
                    { $unwind: { path: "$additionalDetails", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            image: 1,
                            additionalDetails: 1,
                        },
                    },
                ],
            },
        },
        { $unwind: { path: "$instructorDetails", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "categories", // Get category details
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        
        {
            $lookup: {
                from: "ratingandreviews", // Get ratings and reviews
                localField: "ratingAndreviews",
                foreignField: "_id",
                as: "ratings",
                pipeline: [
                    {
                        $lookup: {
                            from: "users", // Get user details for reviews
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            user: {
                                firstName: 1,
                                lastName: 1,
                                email: 1,
                                image: 1,
                            },
                            rating: 1,
                            review: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "sections", // Get course content (sections)
                localField: "courseContent",
                foreignField: "_id",
                as: "courseContent",
                pipeline: [
                    {
                        $lookup: {
                            from: "subsections", // Get subsections for each section
                            localField: "subSection",
                            foreignField: "_id",
                            as: "subSection",
                            pipeline: [
                                {
                                    $project: {
                                        title: 1,
                                        timeDuration: 1,
                                        description: 1,
                                        videoUrl: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $project: {
                            sectionName: 1,
                            subSection: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                courseName: 1,
                courseDescription: 1,
                instructor: "$instructorDetails",
                whatYouWillLearn: 1,
                courseContent: 1,
                ratings: 1,
                price: 1,
                thumbnail: 1,
                tag: 1,
                category: 1,
                studentsEnrolled: 1,
                instructions: 1,
                status: 1,
                averageRating: 1,
                totalRatings: { $size: "$ratings" },
                totalStudentsEnrolled: { $size: "$studentsEnrolled" },
                
            },
        },
    ];

    // Execute the aggregation pipeline to get the course details
    const courseDetails = await courseModel.aggregate(courseDetailsPipeline);

    let courseProgressCount = await courseProgressModal.findOne({
          courseID: courseId,
          userId: userId,
        })
        

        
    // Check if course exists
    if (!courseDetails || courseDetails.length === 0) {
        return res. ApiError(404, "Course not found.");
    }

    courseDetails[0].completedVideos = courseProgressCount?.completedVideos
    ? courseProgressCount?.completedVideos
    : []

   

    // Send the response with course details
    return res.status(200).json(
        new ApiResponse(200, courseDetails[0],"Course details fetched successfully") // Return the first course object
    );
} 
);


//get all course details for give instructor
exports.getInstructorCourse = asyncHandler(async (req, res) => {
  try {
    
    
    const instructorId = req?.user?._id;
    

    // Find all courses belonging to the instructor
    let instructorCourses = await courseModel
      .find({ instructor: instructorId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .sort({ createdAt: -1 })
      .exec();

  

    // Convert Mongoose documents to plain JavaScript objects
    instructorCourses = instructorCourses.map(course => course.toObject());

    // Calculate total duration for each course
    instructorCourses.forEach(course => {
      let totalDurationInSeconds = 0;

      course.courseContent.forEach(content => {
        totalDurationInSeconds += content.subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration, 10),
          0
        );
      });

      // Convert total duration from seconds to HH:MM:SS format
      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    });

    
    
    res.status(200).json(new ApiResponse(200, instructorCourses, "Get instructor courses"));
  } catch (error) {
    console.error("Error in getInstructorCourse:", error);
    return res.ApiError(500, "Failed to retrieve instructor courses", error.message);
  }
});
