
const jwt = require("jsonwebtoken");
require("dotenv").config();
const asyncHandler = require("../utils/asyncHandler");
const {ACCESS_TOKEN_SECRET} = require("../constant")



exports.auth = asyncHandler( async(req, res, next)=>{

    try {
       
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || req.body.accessToken
       
        if(!accessToken){
            return res. ApiError( 401, "accessToken is missing");
        }
     
        try {
            const decodedToken =  jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
           
            req.user = decodedToken
        } catch (error) {
            console.error("Access token verification failed:", error);
            return res. ApiError(401, "Invalid or expired access token");
        }
        
        next();
        
    } catch (error) {
     
        return res. ApiError(401,"Something went wrong while validating the token in auth")
    }
})


//isStudent
exports.isStudent = asyncHandler( async(req,res,next)=>{
    
    if(req.user.accountType !== "Student"){
        return res. ApiError(401, "protected Route for student only")
    }

    next();
})


//isInstructor
exports.isInstructor = asyncHandler( async(req,res,next)=>{
    
    if(req.user.accountType !== "Instructor"){
        return res. ApiError(401, "protected Route for Instructor only")
    }
   
    next();
})

//isAdmin
exports.isAdmin = asyncHandler( async(req,res,next)=>{

    if(req.user.accountType !== "Admin"){
        return res. ApiError(401, "protected Route for Admin only")
    }

    next();
})