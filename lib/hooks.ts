"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setAreFieldsEmptyCheck } from "./features/general/general";

export function useAuth(requiredRole?: "user" | "admin") {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/" && pathname !== "/auth/login") {
      if (pathname === "/auth/signup") {
        router.push("/auth/signup");
        return;
      } else {
        router.push("/auth/login");
        return;
      }
    }

    if ((requiredRole && user?.role !== requiredRole) || isAuthenticated) {
      if (user?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [isAuthenticated, requiredRole, router, user]);

  return { user, isAuthenticated };
}

export function useFieldsEmptyCheck(obj: Record<string, any>) {
  const dispatch = useDispatch();
  useMemo(() => {
    const isEmpty = Object.values(obj).some(
      (value) => value === undefined || value === ""
    );
    dispatch(setAreFieldsEmptyCheck(isEmpty));
  }, [obj]);
}
