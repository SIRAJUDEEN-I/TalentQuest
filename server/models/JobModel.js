import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        default: "Remote",
    },
    salary: {
        type: Number,
        required: true,
    },
    salaryType: {
        type: String,
        default: "yearly",
    },
    negotiable: {
        type: Boolean,
        default: false,
    },
    jobType: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags:[
        {type:String},
    ],

    skills:[{
            type:String,
        }],
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        
    ],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    applicants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    
    
   
}, {
    timestamps: true,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;