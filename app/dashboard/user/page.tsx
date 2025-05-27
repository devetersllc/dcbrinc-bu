"use client";
import { useAuth } from "@/lib/hooks";
import MainTabs from "./MainTabs";
import SkeletonLoader from "./Component/SkeletonLoader";

export default function UserDashboard() {
  const { user } = useAuth("user");

  if (!user) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-1 px-1 sm:px-2 md:px-6 lg:px-16 pb-8">
      <MainTabs />
    </div>
  );
}
