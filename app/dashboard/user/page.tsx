"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { useAuth } from "@/lib/hooks";
import MainTabs from "./components/tabs";

export default function UserDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth("user");

  const handleLogout = async () => {
    try {
      // Call the logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Update Redux state
      dispatch(logoutUser());

      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Don't render anything until we've checked authentication
  if (!user) {
    return <div className="py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-1 px-10">
      {/* <Button onClick={handleLogout} variant="outline">
        Logout
      </Button> */}
      <MainTabs />
    </div>
  );
}
