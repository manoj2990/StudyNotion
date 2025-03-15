
const {
    ACCESS_TOKEN_SECRET, 
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET, 
    REFRESH_TOKEN_EXPIRY} = require("../constant")

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    accountType:{
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref: "profile"
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "course"
        }
    ],
    image: {
        type: String,
        required: true
    },
    courseProgress:[
        {
         type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress"
        }
    ],
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type:Date
    },
    refreshToken: {
        type: String
    },
},{timestamps: true})



// Password encrypt pre-middleware
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});


//custom password compare function
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
 }

//TO generate Access-Token
userSchema.methods.generateAccessToken =   function(){
   
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            accountType: this.accountType
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}


//To generate Refresh-Token
userSchema.methods.generateRefreshToken =  function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}



module.exports = mongoose.model("user", userSchema);