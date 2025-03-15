


const mongoose = require("mongoose");


const CategorySchema = new mongoose.Schema({

  name:{
    type: String,
    required: true
  },
  description:{
    type: String
  },
  courses:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "course"
  }]
},{ timestamps: true })

module.exports = mongoose.model("category", CategorySchema);