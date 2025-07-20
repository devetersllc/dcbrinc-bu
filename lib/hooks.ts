"use client";

import { use, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { useMemo } from "react";
import { setAreFieldsEmptyCheck } from "./features/general/general";
import {
  setUser,
  logoutUser,
  type UserPermissions,
  User,
} from "./features/auth/authSlice";
import { verifyToken } from "./auth";

export function useAuth(
  requiredRole?: "user" | "admin" | "sub-admin",
  requireAuth = true
) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("user-----------", user);

  const userDataFetch = async () => {
    const response = await fetch(`/api/auth/me?_id=${user?._id}`);

    let resultData: User = await response.json();
    dispatch(
      setUser({
        createdAt: resultData?.createdAt,
        email: resultData?.email,
        name: resultData?.name,
        permissions: resultData?.permissions,
        role: resultData?.role,
        _id: resultData?._id,
      })
    );
  };
  useEffect(() => {
    // Check token and update user data with permissions
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];
    // console.log("user", user?._id);

    if (user?.role === "sub-admin") {
      userDataFetch();
    }
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        // Update user in Redux with permissions from token
        const userData = {
          _id: decoded.id,
          name: user?.name || "",
          email: decoded.email,
          role: decoded.role as "user" | "admin" | "sub-admin",
          permissions: decoded.permissions,
          createdAt: user?.createdAt || new Date().toISOString(),
        };
        dispatch(setUser(userData));
      } else {
        dispatch(logoutUser());
      }
    }

    if (
      requireAuth &&
      !isAuthenticated &&
      pathname !== "/" &&
      !pathname.startsWith("/auth/")
    ) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && user) {
      // Handle routing based on role
      if (requiredRole && user.role !== requiredRole) {
        if (user.role === "admin" || user.role === "sub-admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      }
    }
  }, [
    isAuthenticated,
    requiredRole,
    router,
    user?._id,
    user?.createdAt,
    user?.email,
    user?.name,
    user?.permissions?.bookOrders,
    user?.permissions?.cardOrders,
    user?.permissions?.users,
    user?.role,
    dispatch,
    pathname,
    requireAuth,
  ]);

  // Check if user has specific permission
  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user || !isAuthenticated) return false;
    if (user.role === "admin") return true;
    if (user.role === "sub-admin") {
      return user.permissions?.[permission] || false;
    }
    return false;
  };

  // Check if user can access admin features
  const canAccessAdmin = (): boolean => {
    return user?.role === "admin" || user?.role === "sub-admin";
  };

  return {
    user,
    isAuthenticated,
    hasPermission,
    canAccessAdmin,
  };
}

export function useFieldsEmptyCheck(obj: Record<string, any>) {
  const dispatch = useDispatch();
  useMemo(() => {
    const isEmpty = Object.values(obj).some(
      (value) => value === undefined || value === "" || value === null
    );
    dispatch(setAreFieldsEmptyCheck(isEmpty));
  }, [obj, dispatch]);
}
