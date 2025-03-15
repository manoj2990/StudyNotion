
const ratingAndreviewModel = require("../models/ratingAndreview.model");
const courseModel = require("../models/course.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");




//create rating
exports.create_rating_review = asyncHandler( async(req, res)=>{


    const {courseID, rating, review} = req.body;
    const userID = req.user.id;

    if(!userID || !rating || !review ||!courseID){
        return res. ApiError(400, "Required all feilds")
    }
    
    const courseDetail = await courseModel.findOne({_id: courseID});
    if(!courseDetail){
        return res. ApiError(400, "course details not found")
    }

    const isEnrolled = courseDetail.studentsEnrolled.includes(userID);
    if(!isEnrolled){
        return res. ApiError(400, "student not enrolled into course");
    }

    const AlreadyReview = await ratingAndreviewModel.findOne({
        user: userID,
        course: courseID
    })

    if(AlreadyReview){
        return res.status(403)
        .json( new ApiResponse(403, "Student already review"))
    }

    const ratingAndreview = await ratingAndreviewModel.create(
        {
            user: userID,
            course: courseID,
            rating: rating,
            review: review
        })
    

    if(!ratingAndreview){
        return res. ApiError(400, "failed to create Review");
    }

    await courseModel.findByIdAndUpdate(courseID,
        {
            $push: { ratingAndreviews: ratingAndreview._id}
        },
        {new: true});
    
     
    return res.status(200)
    .json( new ApiResponse(200, "Rating & Review the course succesfully"))


})



//getAverageRating
exports.average_rating_review = asyncHandler( async(req, res)=>{
    const courseID = req.body.courseID;

    if(!courseID){
         return res. ApiError(401, "Required all field")
    }

    const result = await ratingAndreviewModel.aggregate([
        {
            $match:{
                course: new mongoose.Schema.Types.ObjectId(courseID)
            }
        },
        {
            $group:{
                _id: null,
                averageRating:{ $avg: "rating"}
            }
        }
    ])

    if(result.length > 0){
        return res.status(200)
        .json( new ApiResponse(200, {averageRating : result[0].averageRating}, "get average rating succesfully"));
    }
    else{
        return res.status(200)
        .json( new ApiResponse(200, {averageRating : 0}, "No Rating yet"));
    }
})


//getAllrating
exports.all_Rating_and_Review = asyncHandler( async(req, res)=>{
    
    const courseID = req.body.courseID;

    if(!courseID){
        return res. ApiError(401, "Required all field")
   }

   const Rating_and_Review = await ratingAndreviewModel.find({})
                                   .sort({rating: "desc"})
                                   .populate({
                                    path: "user",
                                    select: "firstName lastName email image"
                                   })
                                   .populate({
                                    path: "course",
                                    select: "courseName"
                                   })

    return res.status(200) 
    .json( new ApiResponse(200, Rating_and_Review, "All review fetched succcesfully"))                             

})