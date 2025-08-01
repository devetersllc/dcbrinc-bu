"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Start from "./Start/page";
import CopyRight from "./CopyRight/page";
import Design from "./Design/page";
import Details from "./Details/page";
import Pricing from "./Pricing/page";
import Review from "./Review/page";
import { setActiveTab } from "@/lib/features/general/general";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";
import MakeCard from "./MakeCard/page";
import { useSearchParams } from "next/navigation";
import { setType, StartPageState } from "@/lib/features/data/startPageSlice";

export default function MainTabs() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const general = useSelector((state: RootState) => state.general);
  const startPage = useSelector((state: RootState) => state.startPage);
  const searchParams = useSearchParams();
  const type =
    (searchParams.get("type") as StartPageState["type"]) || "print-book";
  useEffect(() => {
    dispatch(setType(type));
  }, [type]);

  const TabsArray = useMemo(
    () => [
      ...(general.serviceType === "books"
        ? [
            { name: "Start", page: Start },
            { name: "Design", page: Design },
          ]
        : [{ name: "Make Card", page: MakeCard }]),
      { name: "Review", page: Review },
    ],
    [general.serviceType]
  );

  const tabEnabled = useCallback(
    (index: number) => {
      return (
        (!general.areFieldsEmptyCheck && general.activeTab === index - 1) ||
        general.activeTab > index - 1
      );
    },
    [general.areFieldsEmptyCheck, general.activeTab]
  );

  return (
    <Tabs
      defaultValue="Start"
      className={`w-[100%]`}
      onValueChange={(e: string) => {
        const index = TabsArray.findIndex((tab) => tab.name === e);
        dispatch(setActiveTab(index));
      }}
      value={TabsArray[general.activeTab]?.name}
    >
      <div className="px- w-full sticky top-1 z-10">
        <TabsList
          className={`grid border-2 ${
            general.serviceType === "books" ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {TabsArray.map((tab, index) => (
            <TabsTrigger
              disabled={!tabEnabled(index)}
              key={index}
              value={tab?.name}
              className={`${
                tabEnabled(index) ? "cursor-pointer" : "cursor-not-allowed"
              }`}
            >
              {tab?.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div>
        {TabsArray.map((tab, index) => (
          <TabsContent key={index} value={tab.name}>
            <tab.page />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
