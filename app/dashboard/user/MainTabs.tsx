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
import { useCallback, useMemo } from "react";

export default function MainTabs() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const general = useSelector((state: RootState) => state.general);
  const startPage = useSelector((state: RootState) => state.startPage);
  console.log("state", state.design);

  const TabsArray = useMemo(
    () => [
      { name: "Start", page: Start },
      // ...(startPage.goal === "publish"
      //   ? [{ name: "CopyRight", page: CopyRight }]
      //   : []),
      { name: "Design", page: Design },
      // ...(startPage.goal === "publish"
      //   ? [
      //       { name: "Details", page: Details },
      //       { name: "Pricing", page: Pricing },
      //     ]
      //   : []),
      { name: "Review", page: Review },
    ],
    [startPage.goal]
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
            startPage.goal === "publish" ? "grid-cols-3" : "grid-cols-3"
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
