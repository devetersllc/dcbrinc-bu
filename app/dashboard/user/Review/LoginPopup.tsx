import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { setShowLoginDialog } from "@/lib/features/general/general";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function LoginPopup() {
  const [type, setType] = useState<"Login" | "Signup">("Login");
  const dispatch = useDispatch();
  function onSuccessFunc() {
    dispatch(setShowLoginDialog(false));
  }
  return (
    <div className="flex w-full bg-white items-center h-full justify-center md:justify-start space-y-6 p-0 ">
      <div className="flex w-full flex-col justify-center space-y-6 md:w-full 2xl:w-full p-0 md:p-1 2xl:ps-2">
        <div className="flex flex-col space-y-2 text-center justify-start">
          <p className="text-sm text-muted-foreground text-start">
            Enter your credentials to sign in to your account
          </p>
        </div>
        {type === "Login" ? (
          <LoginForm userType={"user"} onSuccess={onSuccessFunc} />
        ) : (
          <SignupForm onSuccess={onSuccessFunc} />
        )}
        <p className="px-8 text-center text-sm text-muted-foreground">
          {type === "Login" ? (
            <>Don't have an account? </>
          ) : (
            <>Already have an account? </>
          )}
          <span
            onClick={() => {
              setType(type === "Login" ? "Signup" : "Login");
            }}
            className="underline underline-offset-4 hover:text-primary cursor-pointer"
          >
            {type === "Login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
