"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useAuth();

  useEffect(() => {
    setIsAdmin(window.location.hostname.includes("admin"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Lulu</h1>
        <p className="text-lg text-muted-foreground">
          A complete Book Publishing Platform
        </p>
        {!isAuthenticated && (
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
            {isAdmin === false && (
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
