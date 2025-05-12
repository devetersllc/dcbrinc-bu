"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/lib/features/auth/authSlice";
import { useAuth } from "@/lib/hooks";
import MainTabs from "./components/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="min-h-screen flex flex-col items-center justify-start py-1 px-10">
        <div className="w-full">
          {/* TabsList Skeleton */}
          <div className="px-2 w-full sticky top-1 z-10">
            <div className="grid border-2 grid-cols-3 gap-2 p-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 rounded-md" />
              ))}
            </div>
          </div>

          {/* TabsContent Skeleton */}
          <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
            <Skeleton className="h-6 w-1/3 mb-6" /> {/* Title skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="relative">
                  <div className="block h-full ring-2 ring-transparent rounded-lg">
                    <div className="h-full border overflow-hidden rounded-lg">
                      <Skeleton className="h-40 w-full bg-gray-100" />{" "}
                      {/* Image placeholder */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-4 w-4 rounded-full" />{" "}
                          {/* Radio placeholder */}
                          <Skeleton className="h-4 w-24" />{" "}
                          {/* Title placeholder */}
                        </div>
                        <Skeleton className="h-3 w-32" />{" "}
                        {/* Description placeholder */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>{" "}
      </div>
    );
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
