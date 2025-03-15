

const userModel = require("../models/user.model");
const mailSender = require("../utils/mailSender");
const ApiResponse = require("../utils/ApiResponse");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const resetPasswordTempplate =  require("../mail/templates/resetPasswordTemplate")


// Reset Password Token
exports.resetPasswordToken = asyncHandler(async (req, res) => {


    const { email } = req.body;

    if (!email) {
        return res. ApiError(400, "Email is required.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res. ApiError(404, "This email is not registered.");
    }

    const token = crypto.randomUUID();
    const resetUrl = `http://localhost:3000/update-password/${token}`;

    // Update user's reset token and expiration time
    const updatedDetails = await userModel.findOneAndUpdate(
        { email: email },
        {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000,
        },
        { new: true }
    );

    
    const name = `${updatedDetails.firstName}`+`${updatedDetails.lastName}`
  
    await mailSender(
        email,
        "Password Reset Link",
        resetPasswordTempplate(email,name,resetUrl)
    );

    return res.status(200).json(
        new ApiResponse(200, null,"Password reset link sent successfully. Please check your email.")
    );
});


// Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {

    const { password, confirmPassword, resetPasswordToken } = req.body;

    if (!password || !confirmPassword || !resetPasswordToken) {
        return res. ApiError(400, "All fields are required.");
    }

    if (password !== confirmPassword) {
        return res. ApiError(400, "Passwords do not match.");
    }

    const user = await userModel.findOne({ resetPasswordToken });
    if (!user) {
        return res. ApiError(401, "Invalid reset password token.");
    }

    if (user.resetPasswordExpires < Date.now()) {
        return res. ApiError(401, "Reset password token has expired.");
    }

    // Update the password
    user.password = confirmPassword;
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpires = undefined; 
    const updatedDetails = await user.save({ validateBeforeSave: false });

    
    return res.status(200).json(
        new ApiResponse(200, null,"Password reset successfully.")
    );
});
