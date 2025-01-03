import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    auth0Id: {
        type: String,
        unique: true,
        required: true,
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }],
    role: {
        type: String,
        enum: ["jobseeker", "recruiter"],
    },
    resume: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        default: "Bio Not Available",
    },
    profession: {
        type: String,
        default: "Unemployed",
    },
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;