"use client";
import { useEffect } from "react";
import MainTabs from "../dashboard/user/MainTabs";
import { setServiceType } from "@/lib/features/general/general";
import { useDispatch } from "react-redux";

export default function Books() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setServiceType("cards"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <MainTabs />
      </div>
    </div>
  );
}
