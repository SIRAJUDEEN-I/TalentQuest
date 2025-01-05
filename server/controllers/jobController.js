import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Job from "../models/JobModel.js";


export const createJob = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({auth0Id:req.oidc.user.sub});
        const isAuth = req.oidc.isAuthenticated() || user.email;

        if(!isAuth){
            return res.status(401).json({message:"User not authenticated"});
        }

        const {title,description,location,salary,jobType,tags,skills,salaryType,negotiable} = req.body;

        if(!title){
            return res.status(400).json({message:"Title is required"});
        }
        if(!description){
            return res.status(400).json({message:"Description is required"});
        }
        if(!location){
            return res.status(400).json({message:"Location is required"});
        }
        if(!salary){
            return res.status(400).json({message:"Salary is required"});
        }
        if(!jobType){
            return res.status(400).json({message:"Job type is required"});
        }
        if(!tags){
            return res.status(400).json({message:"Tags are required"});
        }
        if(!skills){
            return res.status(400).json({message:"Skills are required"});
        }

        const job = new Job({
            title,description,location,salary,jobType,tags,skills,salaryType,negotiable,createdBy:user._id,
        });

        await job.save();

        return res.status(201).json(job);

    } catch (error) {
        console.log("error in creating job", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }});

export const getJobs = expressAsyncHandler(async (req, res) => {
    try {
        const jobs = await Job.find({}).populate("createdBy","name profilePicture").sort({createdAt:-1});
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("error in getting jobs", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export const getJobByUser = expressAsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const jobs = await Job.find({createdBy:user._id}).populate("createdBy","name profilePicture").sort({createdAt:-1});

        return res.status(200).json(jobs);
    } catch (error) {
        console.log("error in getting job by user", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});    

export const searchJobs = expressAsyncHandler(async (req, res) => {

    try {
        const {tags,location,title} = req.query;

        let query = {};

        if(tags){
            query.tags = {$in:tags.split(",")};
        }

        if(location){
            query.location = location;
        }
        if(title){
            query.title = {$regex:title,$options:"i"};
        }
        const jobs = await Job.find(query).populate("createdBy","name profilePicture");
        return res.status(200).json(jobs);
    } catch (error) {
        console.log("error in searching jobs", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});

export const applyJob = expressAsyncHandler(async (req, res) => {  
    //apply job
    try {
        const user = await User.findOne({auth0Id:req.oidc.user.sub});
       
        const job = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

       

        if(job.applicants.includes(user._id)){
            return res.status(400).json({message:"You have already applied for this job"});
        }

        job.applicants.push(user._id);
        await job.save();
        return res.status(200).json({message:"Applied successfully"});

    } catch (error) {
        console.log("error in applying job", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});

export const likeJob = expressAsyncHandler(async (req, res) => {
    //like job
    try {
        const job  = await Job.findById(req.params.id);
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        const user = await User.findOne({auth0Id:req.oidc.user.sub});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isLiked = job.likes.includes(User._id);

        if(isLiked){
            job.likes = job.likes.filter((like)=>!like.equals(User._id));
        }else{
            job.likes.push(User._id);
        }
        await job.save();
        return res.status(200).json(job);
    } catch (error) {
        console.log("error in liking job", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});

export const getJobById = expressAsyncHandler(async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("createdBy","name profilePicture");
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        return res.status(200).json(job);
    } catch (error) {
        console.log("error in getting job by id", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});

export const deleteJob = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const job = await Job.findById(id);
        const user = await User.findOne({auth0Id:req.oidc.user.sub});
        if(!job){
            return res.status(404).json({message:"Job not found"});
        }
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        await job.deleteOne({
            _id:id,
        });
        return res.status(200).json({message:"Job deleted successfully"});
    } catch (error) {
        console.log("error in deleting job", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
});