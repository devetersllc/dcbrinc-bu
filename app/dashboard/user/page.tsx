"use client";
import { useAuth } from "@/lib/hooks";
import MainTabs from "./MainTabs";
import Navbar from "./Navbar/Navbar";

export default function UserDashboard() {
  // Allow access without authentication
  useAuth(undefined, false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <MainTabs />
      </div>
    </div>
  );
}
