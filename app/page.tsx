'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Home() {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("user, isAuthenticated", user, isAuthenticated, "branch shifted to origin");
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Lulu 
        </h1>
        <p className="text-lg text-muted-foreground">
          A complete Book Publishinf Platform
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
