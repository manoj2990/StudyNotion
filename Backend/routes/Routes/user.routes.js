
const express = require("express")
const router = express.Router()

//import auth controller
const {
    loginUser,
    signUp,
    sendOTP,
    changeCurrentPassword,
  } = require("../../controllers/auth.controller")



//import resetPassword controller
const {
    resetPasswordToken,
    resetPassword,
  } = require("../../controllers/resetPassword.controller")

  
//middlewares
const { auth } = require("../../middlewares/auth.middleware")





// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", loginUser)

// Route for user signup
router.post("/signup", signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changeCurrentPassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router