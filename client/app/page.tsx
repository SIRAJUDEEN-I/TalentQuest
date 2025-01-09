"use client";
import { useGlobalContext } from "@/context/globalContext";
import Link from "next/link";

export default function Home() {
  const {isAuthenticated} = useGlobalContext();
  console.log(isAuthenticated);
  return (
    <div>
     <Link  href={"http://localhost:8000/login"} >Login</Link>

    </div>
  );
}
