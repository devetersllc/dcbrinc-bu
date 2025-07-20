"use client";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/lib/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import loginPage from "@/public/assets/Login-bro.svg";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useAuth(undefined, false);

  useEffect(() => {
    setIsAdmin(window.location.hostname.includes("admin"));
  }, []);
  console.log("user?.role-----------", user?.role);

  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else if (user?.role === "admin" || user?.role === "sub-admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen w-full items-center bg-white justify-between">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-24 md:top-12 2xl:left-40 2xl:top-24"
      >
        <Image
          src="https://dcbrinc.com/wp-content/uploads/2025/03/IMG_6463-2-1024x779-1.png"
          alt="Color book example"
          className="object-cover h-fit w-[200px]"
          width={20}
          height={10}
        />
      </Link>
      <div className="flex w-full md:w-1/2 bg-white items-center h-full justify-center md:justify-start space-y-6 p-4 md:p-24 2xl:p-40">
        <div className="flex w-full flex-col justify-center space-y-6 md:w-full 2xl:w-full p-0 md:p-1 2xl:ps-2">
          <div className="flex flex-col space-y-2 text-center justify-start">
            <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-start">
              Welcome back {isAdmin && "Admin"}
            </h1>
            <p className="text-sm text-muted-foreground text-start">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <LoginForm userType={isAdmin ? "admin" : "user"} />
          {isAdmin === false && (
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className="w-1/2 bg-white h-[100%] p-2 hidden md:block">
        <div className="w-full rounded-lg bg-[rgba(0,160,153,0.4)] h-[100%] flex items-center justify-center md:justify-end p-4 md:p-24">
          <Image
            src={loginPage || "/placeholder.svg"}
            alt="Login Animation"
            width={500}
            height={500}
            className="w-full h-fit object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
