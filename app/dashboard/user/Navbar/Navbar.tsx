"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { setServiceType } from "@/lib/features/general/general";

export default function Navbar() {
  const dispatch = useDispatch();
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
        className="h-8 md:h-10 flex items-center justify-centerw-fit cursor-pointer"
      >
        <Image
          src="https://dcbrinc.com/wp-content/uploads/2025/03/IMG_6463-2-1024x779-1.png"
          alt="Color book example"
          className="object-cover h-full w-full"
          width={20}
          height={10}
        />
      </Link>

      <div className="flex justify-start gap-2 md:gap-6 items-center">
        <div className="flex justify-start gap-2 md:gap-4 items-center">
          <span
            className="text-sm text-gray-600 cursor-pointer hover:underline"
            onClick={() => {
              dispatch(setServiceType("books"));
            }}
          >
            Books
          </span>
          <span
            className="text-sm text-gray-600 cursor-pointer hover:underline"
            onClick={() => {
              dispatch(setServiceType("cards"));
            }}
          >
            Cards
          </span>
        </div>
        <div className="flex justify-start gap-4 items-center border-l pl-2 md:pl-4">
          {user && (
            <div className="items-center space-x-4 hidden md:flex">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{user.name}</span>
              </div>
            </div>
          )}
          <ProfileDropDown />
        </div>
      </div>
    </div>
  );
}
