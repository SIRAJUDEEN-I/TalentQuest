"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobsContext";
import { Job } from "@/types/types";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Separator } from "../ui/separator";
import formatMoney from "../../utils/formatMoney";
import { formatDates } from "../../utils/formatDates";
import { bookmark, bookmarkEmpty } from "@/utils/Icons";

interface JobProps {
  job: Job;
  activeJob?: boolean;
}

function JobCard({ job, activeJob }: JobProps) {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [isLiked, setIsLiked] = React.useState(false);

  const {
    title,

    salaryType,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
  } = job;

  const { name, profilePicture } = createdBy;

  const router = useRouter();

  const handleLike = (id: string) => {
    setIsLiked((prev) => !prev);
    likeJob(id);
  };

  useEffect(() => {
    setIsLiked(job.likes.includes(userProfile._id));
  }, [job.likes, userProfile._id]);

  const companyDescription = job.description ? job.description : "No description";

  const jobTypeBg = (type: string) => {
    switch (type) {
      case "Full Time":
        return "bg-green-500/20 text-green-600";
      case "Part Time":
        return "bg-purple-500/20 text-purple-600";
      case "Contract":
        return "bg-red-500/20 text-red-600";
      case "Internship":
        return "bg-indigo-500/20 text-indigo-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  return (
    <div
      className={`p-8 rounded-xl flex flex-col gap-5
    ${
      activeJob
        ? "bg-gray-50 shadow-md border-b-2 border-[#7263f3]"
        : "bg-white"
    }`}
    >
      <div className="flex justify-between">
        <div
          className="group flex gap-1 items-center cursor-pointer"
          onClick={() => router.push(`/job/${job._id}`)}
        >
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            <Image
              src={profilePicture || "/user.png"}
              alt={name || "User"}
              width={40}
              height={40}
              className="rounded-md"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="group-hover:underline font-bold">{title}</h4>
            <p className="text-xs">
              {name}: {applicants.length}{" "}
              {applicants.length > 1 ? "Applicants" : "Applicant"}
            </p>
          </div>
        </div>

        <button
          className={`text-2xl ${
            isLiked ? "text-[#7263f3]" : "text-gray-400"
          } `}
          onClick={() => {
            isAuthenticated
              ? handleLike(job._id)
              : router.push("http://localhost:8000/login");
              
          }}
        >
          {isLiked ? bookmark : bookmarkEmpty}
        </button>
      </div>

      <div className="flex items-center gap-2">
        {Array.isArray(jobType) && jobType.map((type, index) => (
          <span
            key={index}
            className={`py-1 px-3 text-xs font-medium rounded-md border ${jobTypeBg(
              type
            )}`}
          >
            {type}
          </span>
        ))}
      </div>

      <p>
        {companyDescription.length > 100
          ? `${companyDescription.substring(0, 100)}...`
          : companyDescription}
      </p>

      <div className="flex flex-wrap gap-4">
        {job.tags?.map((tag: string, index: number) => (
          <span
            key={index}
            className="px-4 py-1 rounded-full text-sm font-medium flex items-center bg-red-500/20 text-red-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <Separator />

      <div className="flex justify-between items-center gap-6">
        <p>
          <span className="font-bold">{formatMoney(salary, "INR")}</span>
          <span className="font-medium text-gray-400 text-lg">
            /
            {salaryType === "Yearly"
              ? "per annum"
              : salaryType === "Monthly"
              ? "per month"
              : salaryType === "Weekly"
              ? "per week"
              : "per hour"}
          </span>
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-400">
          <span className="text-lg">
            <Calendar size={16} />
          </span>
          Posted: {formatDates(createdAt)}
        </p>
      </div>
    </div>
  );
}

export default JobCard;