

const userModel = require("../models/user.model");
const otpModel = require("../models/otp.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const profileModel = require("../models/profile.model");
const otpGenerator = require("otp-generator");




// Utility function to generate access and refresh tokens
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    
    const user = await userModel.findById(userId);
    const accessToken = user.generateAccessToken();
    
    const refreshToken = user.generateRefreshToken();
  

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res.ApiError(500, "Failed to generate access and refresh tokens");
  }
};



// Send OTP
exports.sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res. ApiError(400, "Email is required",  [{ field: "name", message: "Name is required" }]);
  }

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res. ApiError(401, "User already registered");
  }

  // Check for existing valid OTP
  const existingOtp = await otpModel.findOne({ email });
  if (existingOtp) {
    return res. ApiError(400, "OTP already sent. Please wait before requesting again.");
  }

  // Generate a unique OTP
  var otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const result = await otpModel.findOne({ otp: otp });
  while (result) {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
    });
  }

 
  // Save OTP to the database
  const otpPayload = { email, otp };
  await otpModel.create(otpPayload);

  return res.status(200).json(new ApiResponse(200, { otp }, "OTP sent successfully"));
});

// Sign Up
exports.signUp = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    otp,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !otp
    
  ) {
    return res. ApiError(400, "All fields are required");
  }

  if (password !== confirmPassword) {
    return res. ApiError(400, "Passwords do not match");
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res. ApiError(400, "User is already registered");
  }

  const recentOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });
  if (!recentOtp || recentOtp.otp !== otp) {
    return res. ApiError(400, "Invalid OTP");
    
  }

  const profileDetails = await profileModel.create({
    gender: null,
    dateOfBirth: null,
    about: null,
    contactNumber: null,
  });

  const result = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    accountType,
    additionalDetails: profileDetails._id,
    image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
  })

  const { password: removePassword, ...user } = result.toObject();

  return res.status(200).json(new ApiResponse(200, user, "User signed up successfully"));
});




// Login
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.ApiError(400, "All fields are required");
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res. ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  
  if (!isPasswordValid) {
     return res.ApiError(401, "passs match nhi ho rha");
  
  }

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  };



  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});



// Change Password
exports.changeCurrentPassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res. ApiError(400, "All fields are required");
  }

  const user = await userModel.findById(req.user?._id);
  if (!user) {
    return res. ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    return res. ApiError(401, "Invalid old password");
  }

  if (newPassword !== confirmPassword) {
    return res. ApiError(400, "Passwords do not match");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});
