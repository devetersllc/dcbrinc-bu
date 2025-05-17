"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Start from "./Start/page";
import CopyRight from "./CopyRight/page";
import Design from "./Design/page";
import Details from "./Details/page";
import Pricing from "./Pricing/page";
import Review from "./Review/page";

export default function MainTabs() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const copyWrite = useSelector((state: RootState) => state.copyWrite);
  const design = useSelector((state: RootState) => state.design);
  const detail = useSelector((state: RootState) => state.detail);
  const price = useSelector((state: RootState) => state.price);
  console.log("startPage", startPage);
  console.log("copyWrite", copyWrite);
  console.log("design", design);
  console.log("detail", detail);
  console.log("price", price);

  return (
    <Tabs defaultValue="Start" className="w-[100%]">
      <div className="px- w-full sticky top-1 z-10">
        <TabsList
          className={`grid border-2 ${
            startPage.goal === "publish" ? "grid-cols-6" : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="Start">Start</TabsTrigger>
          {startPage.goal === "publish" && (
            <>
              <TabsTrigger value="Copyright">Copyright</TabsTrigger>
            </>
          )}
          <TabsTrigger value="Design">Design</TabsTrigger>
          {startPage.goal === "publish" && (
            <>
              <TabsTrigger value="Details">Details</TabsTrigger>
              <TabsTrigger value="Pricing">Pricing & Payee</TabsTrigger>
            </>
          )}
          <TabsTrigger value="Review">Review</TabsTrigger>
        </TabsList>
      </div>
      <div>
        <Start />
        {startPage.goal === "publish" && <CopyRight />}
        <Design />
        {startPage.goal === "publish" && <Details />}
        {startPage.goal === "publish" && <Pricing />}
        <Review />
      </div>
    </Tabs>
  );
}
