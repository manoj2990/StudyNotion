
const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");


const OTPSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
        unique: true,
    },
    otp:{
        type:String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
  
},{ timestamps: true });


// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailsender( email,
            "verification Email from studyNotion",
            emailTemplate(otp)
        ) 
        
       
    } 
    catch (error) {
        console.log(`error occured while sending the mails : ${error}`)
        throw error;
    }
}


//pre-middleware
OTPSchema.pre("save", async function(next) {
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
})


module.exports = mongoose.model("otp", OTPSchema);