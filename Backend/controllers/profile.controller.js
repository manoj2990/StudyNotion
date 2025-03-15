const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const profileModel = require("../models/profile.model");
const userModel = require("../models/user.model");
const courseModel = require("../models/course.model");
const mongoose = require("mongoose");
const {uploadOnCloudinary} = require("../utils/cloudinaryUtils");
const {FOLDER_NAME} = require("../constant");
const courseProgressModel = require("../models/courseProgress.model");
const {convertSecondsToDuration} = require('../utils/secToDuration');


// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {

    const userID = req.user?._id;
    const { gender, dateOfBirth = " ", about = " ", contactNumber } = req.body;

    
    if (!userID || !contactNumber) {
        return res. ApiError(400, "All field required");
    }

    const userDetails = await userModel.findById(userID);
    if (!userDetails) {
        return res. ApiError(404, "User not found");
    }

    const profileID = userDetails.additionalDetails;
    if (!profileID) {
        return res. ApiError(404, "Profile ID not found");
    }

    const updatedProfile = await profileModel.findByIdAndUpdate(
        profileID,
        { gender, dateOfBirth, about, contactNumber },
        { new: true }
    );

    if (!updatedProfile) {
        return res. ApiError(500, "Failed to update user profile");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProfile, "User profile updated successfully")
    );
});
  


// Delete Profile (with transaction)****review again****
exports.deleteAccount = asyncHandler(async (req, res) => {

    const userID = req.user._id;
    if (!userID) {
        return res. ApiError(400, "User ID not provided");
    }

    const session = await mongoose.startSession(); //create&start session
    session.startTransaction();

    try {
        const userDetails = await userModel.findById(userID).session(session);
        if (!userDetails) {
            return res. ApiError(404, "User not found");
        }

        const profileID = userDetails.additionalDetails;
        if (!profileID) {
            return res. ApiError(404, "Profile ID not found");
        }

        
        await profileModel.findByIdAndDelete(profileID).session(session);

        await courseModel.updateMany(
            { studentsEnrolled: userID },
            { $pull: { studentsEnrolled: userID } }
        ).session(session);

        await userModel.findByIdAndDelete(userID).session(session);

        await session.commitTransaction();
        session.endSession();//-> Endsession

        return res.status(200).json(
            new ApiResponse(200, null, "User,profile deleted & removed successfully from courses")
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();//-> Endsession
        return res. ApiError(500, "Failed to delete profile or user", error.message);
    }
});



// Get User Details
exports.getUserProfileDetails = asyncHandler(async (req, res) => {
    const userID = req.user._id;

    if (!userID) {
        return res. ApiError(400, "User ID not provided");
    }

    const userProfileDetails = await userModel
        .findById(userID)
        .populate("additionalDetails")
        .exec();

    if (!userProfileDetails) {
        return res. ApiError(404, "User details not found");
    }

    return res.status(200).json(
        new ApiResponse(200, userProfileDetails, "User details retrieved successfully")
    );
});



//update user Display Picture
exports.updateDisplayPicture = asyncHandler( async (req, res) => {
    
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user?._id

      if (!displayPicture) {
        return res. ApiError(400, "No display picture file provided")

    }

     
      const image = await uploadOnCloudinary(
        displayPicture,
        FOLDER_NAME,
        1000,
        1000
      )
      
      
    const updatedProfile = await userModel.findByIdAndUpdate(userId,
        {image: image.secure_url },
        {new: true}
    ).select("-password")

   

      return res.status(200).json(
        new ApiResponse(200, updatedProfile, `Image Updated successfully`)
    );

    } 
    catch (error) {
      return res. ApiError(500,  "failed to update user Display Picture")
    }
}
)
  


exports.getEnrolledCourses = asyncHandler(async (req, res) => {
    

    try {
        const userId = req.user._id;

        // Fetch user details with populated courses
        let userDetails = await userModel.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection"
                    }
                }
            })
            .exec();

        if (!userDetails) {
            return res.ApiError(400, `Could not find user with id: ${userId}`);
        }

        userDetails = userDetails.toObject();
        let SubsectionLength = 0;

        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            SubsectionLength = 0;

            for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration, 10),
                    0
                );

                userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
                SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
            }

            let courseProgressCount = await courseProgressModel.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            });

            courseProgressCount = courseProgressCount?.completedVideos.length || 0;

            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.courses[i].progressPercentage =
                    Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier;
            }
        }

  

        return res.status(200).json(new ApiResponse(200, userDetails.courses));
    } catch (error) {
        console.error("Error in getEnrolledCourses:", error);
        return res.ApiError(500, "Failed to get User Enrolled Courses");
    }
});




exports.instructorDashboard = asyncHandler( async (req, res) => {
    try {
       
        
      const courseDetails = await courseModel.find({ instructor: req.user?._id });
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
      
      return res.status(200).json(new ApiResponse(200,courseData, "sucessfully get Instructor desboard data"));
      
    } catch (error) {
      console.error(error)
      return res.ApiError(500, "Failed to get Instructor desboard data");
    }
  }
)
