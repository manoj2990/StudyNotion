

const mongoose = require("mongoose");


const SectionSchema = new mongoose.Schema({

    sectionName:{
        type: String
    },
    subSection:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "subSection"
        }
    ]
},{ timestamps: true });

module.exports = mongoose.model("section", SectionSchema);