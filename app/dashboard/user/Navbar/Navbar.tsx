"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="p-3 h-fit w-full relative flex items-center justify-between bg-white">
      <Link
        href={"/dashboard/user"}
        className="h-10 flex items-center justify-centerw-fit cursor-pointer"
      >
        <Image
          src="/dummy-logo-5b.png"
          alt="Color book example"
          className="object-cover h-full w-full"
          width={20}
          height={10}
        />
      </Link>
      <div className="flex justify-start gap-4 items-center ">
        {user && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user.name}</span>
            </div>
          </div>
        )}
        <ProfileDropDown />
      </div>
    </div>
  );
}
