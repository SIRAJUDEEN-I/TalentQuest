import express from 'express';
import { createJob,deleteJob,getJobById,likeJob,getJobs,getJobByUser,searchJobs,applyJob } from '../controllers/jobController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

router.post("/jobs",protect,createJob);
router.get("/jobs",protect,getJobs);
router.get("/jobs/user/:id",protect,getJobByUser);

router.get("/jobs/search",searchJobs);

router.put("/jobs/apply/:id",protect,applyJob);
router.put("/jobs/like/:id",protect,likeJob);

router.put("/jobs/:id",protect,getJobById);

router.delete("/jobs/:id",protect,deleteJob);
export default router;

