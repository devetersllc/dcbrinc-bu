"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileDropDown from "./ProfileDropDown";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="p-3 h-fit w-full relative flex items-center justify-between">
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
      <ProfileDropDown />
    </div>
  );
}
