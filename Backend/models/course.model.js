
const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({

    courseName:{
        type: String
    },
    courseDescription:{
        type: String
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    whatYouWillLearn:{
        type: String
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "section"
        }
    ],
    ratingAndreviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratingAndreview"
        }
    ],
    price:{
        type: Number
    },
    thumbnail:{
        type: String
    },
    tag:{
        type: [String],
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    instructions:{
        type: [String]
    },
    status:{
        type: String,
        emun: ["Draft", "Published"]
    },
    
    

},{ timestamps: true })


module.exports = mongoose.model("course", courseSchema);