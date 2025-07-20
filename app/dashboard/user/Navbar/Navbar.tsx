"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { setServiceType } from "@/lib/features/general/general";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  if (pathname.startsWith("/auth/")) {
    return null;
  }
  return (
    <div className="p-3 h-fit w-full relative flex items-center justify-between bg-white shadow-sm">
      <Link
        href={"/"}
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
          {isAuthenticated && user ? (
            <>
              <div className="items-center space-x-4 hidden md:flex">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium">{user.name}</span>
                </div>
              </div>
              <ProfileDropDown />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="items-center space-x-2 hidden md:flex">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Guest User</span>
              </div>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
