
const express = require("express")
const router = express.Router()
const {auth, isInstructor} = require("../../middlewares/auth.middleware");
const {
  deleteAccount,
  updateProfile,
  getUserProfileDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard
} = require("../../controllers/profile.controller");


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

//--> Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getUserProfileDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth,  instructorDashboard)

module.exports = router