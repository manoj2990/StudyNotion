
const {instance} = require("../configration/razorpayConfigration");
const courseModel = require("../models/course.model");
const userModel = require("../models/user.model");
const courseProgressModal = require('../models/courseProgress.model')
const mailsender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentTemplate");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");
const crypto = require("crypto");
const {paymentSuccessEmail} = require("../mail/templates/paymentSucessTemplate");








//enrollStundent function
const enrollStudent = async(courses, userId, res) =>{

    if(!courses || !userId){
        return res. ApiError(404, "provide data for course & userId")
    }

    for( const course_id of courses){
       
        try {
            //find course & enroll student in it
        const enrolledCourse = await courseModel.findByIdAndUpdate(
            {_id: course_id},
            {$push:{studentsEnrolled: userId}},
            {new: true}
        )
        
        if(!enrolledCourse){
            return res. ApiError(500, "course not found")
        }

        //create fresh entery into courseProgressModal with 0 progress
         const courseProgress = await courseProgressModal.create({
                courseID: course_id,
                userId: userId,
                completedVideos: [],
              })

              if(!courseProgress){
                return res. ApiError(500, "courseProgress not found")
            }
    

        //find student & add the corse to their list of enrolledStudent
        const enrolledStudent = await userModel.findByIdAndUpdate(
            userId,
            {
                $push: {
                  courses: course_id,
                  courseProgress: courseProgress._id,
                },
              },
            {new: true}
        )

        if(!enrolledStudent){
            return res. ApiError(500, "enrolledStudent not found")
        }
       
        //send mail to student
        const emailResponse = await mailsender(
                            enrolledStudent.email,
                            `Successfully Enrolled into ${enrolledCourse.courseName}`,
                            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                        )
            

            
        

        } catch (error) {
             return res. ApiError(500, null, "Failed to process enrollment.")
        }


    }
}


//capture the payment & initialize the razorpay order
exports.capturePayment = asyncHandler( async(req, res)=>{

    const {courses} = req.body;
    const userId = req.user?._id;
    

    if(!courses || !userId){
        return res. ApiError(400, "Courses and User ID are required.")
    } 

    if(courses.length === 0){
        return res. ApiError(400, "please provide course.")
    }


    //calculate the total amount of courses
    let totalAmount = 0;
    for(const course_id of courses){ //course_id -> is courseID from the array of cousres ID
        let course;
        try {//find perticular course from DB using perticular course_id
            course = await courseModel.findById(course_id);
            if(!course){
                return res. ApiError(400, "Courses is not found in DB")
            }

            const userObj_id = new mongoose.Types.ObjectId(userId);
          
            if(course.studentsEnrolled.includes(userObj_id)){
                return res. ApiError(400, "student is already Enrolled")
            }

            totalAmount = totalAmount + course.price;

        } catch (error) {
            console.error(error);
            return res. ApiError(500, error.message || "somthing want wrong");
        }

    }


    const options = {
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
        }


        try {
        // initiate payment
        const paymentRespose = await instance.orders.create(options);
        console.log(paymentRespose);

        return res.status(200)
        .json( new ApiResponse(200, paymentRespose,"sucessfully create checkout sesion..."));

        } catch (error) {
        return res. ApiError(500, error.message || "Failed to initiate payment.");
        }


    })



//verify signature of razorpay & server
exports.verifyPayment = asyncHandler( async(req,res)=>{

    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
    const userId = req.user?._id

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
         !razorpay_signature ||
          !razorpay_signature ||
            !courses || !userId
        ){
            return res. ApiError(404, "Payment is failed!!")
        }       
    
        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
        .createHmac("sha256", process.env?.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");
    

    
        if(expectedSignature === razorpay_signature){
    
            //enrolled Student
            await enrollStudent(courses, userId, res);
    
            return res.status(200)
                .json( new ApiResponse(200, "Course purchesed succesfully"));
        }
    
        return res.status(200)
                .json( new ApiResponse(400, "Failed to purchesed course!!!"));
        
    
})


exports.sendPaymentSuccessEmail = asyncHandler( async(req,res)=>{

    const{orderId, paymentId,amount} = req.body;
    const userId = req.user?._id;
    

    if(!orderId || !paymentId || !amount ||!userId){
        return res. ApiError(404, "Provide all fields")
    }

    try {
        const enrolledStudent = await userModel.findById(userId);
       const email =  await mailsender(
            enrolledStudent.email,
            'payment Recieved',
            paymentSuccessEmail( `${enrolledStudent.firstName}`,
                amount/100, orderId, paymentId
            )
        )

        
    } catch (error) {
        return res. ApiError(500, error.message || "Error in Sending mail")
    }
})






