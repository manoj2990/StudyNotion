

const mongoose = require("mongoose");


const ratingAndreviewSchema = new mongoose.Schema({

   user:{
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: "user"
   },
   course:{
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: "course"
   },
   rating: {
    type: Number,
    required: true
   },
   review:{
    type: String,
    required: true
   }
},{ timestamps: true })

module.exports = mongoose.model("ratingAndreview", ratingAndreviewSchema);