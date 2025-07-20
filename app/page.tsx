"use client";
import { useAuth } from "@/lib/hooks";
import UserDashboard from "./dashboard/user/page";

export default function Home() {
  useAuth();  
  return (
    <UserDashboard />
  );
}
