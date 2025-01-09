import axios from 'axios';
import React,{createContext, useContext,useState, useEffect} from 'react';
import { useGlobalContext } from './globalContext';
const JobsContext = createContext();
import {toast} from 'react-hot-toast';
import {useRouter} from "next/navigation"


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const JobsContextProvider = ({children}) => {
    const {userProfile,getUserProfile} = useGlobalContext();
    const [jobs,setJobs] = useState([]);
    const [loading,setLoading] = useState(false);
    const [userJobs,setUserJobs] = useState([]);

    const getJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/jobs");
            setJobs(res.data);
            
        } catch (error) {
            console.log("error getting jobs",error);
        }
        finally{
            setLoading(false);
        }
    };
    const createJob = async (jobData) => {
        try {
            const res = await axios.post("/api/v1/jobs",jobData);
            toast.success("Job createed successfully");
            setJobs((prevJobs) => [res.data, ...prevJobs]);

            if(userProfile._id){
                setUserJobs((prevUserJobs) => [res.data, ...prevUserJobs]);
            }
        } catch (error) {
            console.log("error creating job",error);
        }
    };

    const getUserJobs = async (userId) => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/jobs/user/"+userId);
            setUserJobs(res.data);
            setLoading(false);
        } catch (error) {
            console.log("Error getting jobs",error);
        }
        finally {
            setLoading(false);
        }

    };
    const searchJobs = async(tags,location,title) => {
        setLoading(true);
        try {
            //build query string
            const query = new URLSearchParamas(); 
            if(tags) query.append("tags",tags);
            if(location) query.append("location",location);

            if(title) query.append("title",title);
            const res = await axios.get(`/api/v1/jobs/search/?${query.toString()}`);
            setJobs(res.data);
            setLoading(false);


        } catch (error) {
            console.log("eror searching jobs",error);
        }
        finally{
            setLoading(false);
        }
    }

    const getJobById = async (id) => { 
        setLoading(true);
        try {
            const res = await axios.get(`/api/v1/jobs/${id}`);
            return res.data;
            
        } catch (error) {
            console.log("error getting by id",error);
        }
        finally{
            setLoading(false);
        }
     };

     const likeJob = async (jobId) => {
        try {
            const res = axios.put(`/api/v1/jobs/like/${jobId}`);
            toast.success("Job liked successfully");
            getJobs();
            
        } catch (error) {
            console.log("error liking the job",error);
        }
     };

     const applyToJob = async(jobId) => {
        try {
            const res = axios.put(`/api/v1/jobs/apply/${jobId}`);
            toast.success("Applied to job sucessfully");
        } catch (error) {
            console.log("Error applying to job",error);
        }
     };
     const deleteJob = async (jobId) => {
        try {
            await axios.delete(`/api/v1/jobs/${jobId}`);
            setJobs((prevJobs)=> prevJobs.filter((job) => job._id !== jobId));
            searchJobs((prevJobs) => prevJobs.filter((job)=> job._id !== jobId));
            toast.success("Job delted successfully");
        } catch (error) {
            console.log("error deleteing job",error);
        }
     }

    useEffect(() => {
        getJobs();
        searchJobs("","","tester");
    },[]);

    useEffect(()=>{
        if(userProfile._id){
            getUserJobs(userProfile._id);
        }
    },[userProfile._id]);
    console.log("search ",jobs);
    return (
        <JobsContext.Provider value={{
            jobs,
            loading,
            createJob,
            userJobs,
            searchJobs,
            getJobById,
            likeJob,
            applyToJob,
            deleteJob,
        } }>
            {children}
        </JobsContext.Provider>
    );
};


export const useJobsContext = () => { 
    return useContext(JobsContext);
 };
