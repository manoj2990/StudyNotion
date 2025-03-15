

const express = require("express")
const router = express.Router()



// Course Controllers Import
 const {
    createCourse,
    ShowAllCourses,
    getSpecificCourseDetails,
    getInstructorCourse,
    editCourse,
    deleteCourse
} = require("../../controllers/course.controller");

//courseProgress controller import
const {
  updateCourseProgress
} = require("../../controllers/courseProgress.controller");

// Categories Controllers Import
const {
    createCategory,
    showAllCategories,
    categoryPageDetails,
    deleteCategory,
    updateCategory
} = require("../../controllers/categorys.controller");

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection,
    getAllSectionDetails
  } = require("../../controllers/section.controller");

// Sub-Sections Controllers Import
const {
  createSubsection,
  updateSubsection,
  deleteSubsection,
} = require("../../controllers/subSection.controller");

// Rating Controllers Import
const {
    create_rating_review,
    average_rating_review,
    all_Rating_and_Review,
} = require("../../controllers/ratingAndreview.controller");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../../middlewares/auth.middleware");



// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//-->Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse );
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// delete Course routes "http://localhost:4000/api/v1/course/deleteCourse"
router.delete("/deleteCourse", auth, isInstructor,  deleteCourse)
//-->Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
//-->Edit a section
router.post("/updateSection", auth, isInstructor, updateSection);
//-->Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
//--> Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubsection);
//--> Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubsection);
//--> Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubsection);
//--> Get all Registered Courses
router.get("/getAllCourses", ShowAllCourses)
//--> Get Details for a Specific Courses
router.post("/getFullCourseDetails", getSpecificCourseDetails)
//--> Get get Instructor Course
router.get("/getInstructorCourses", auth, getInstructorCourse)
//-->update course progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)




// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);



// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, create_rating_review)
router.get("/getAverageRating", average_rating_review)
router.get("/getReviews", all_Rating_and_Review)

module.exports = router