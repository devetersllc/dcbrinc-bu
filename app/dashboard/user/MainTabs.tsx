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
import { useCallback, useEffect, useMemo, useState } from "react";
import MakeCard from "./MakeCard/page";
import {
  setType,
  setTypeFromQuery,
  setGoalFromQuery,
  StartPageState,
  setGoal,
} from "@/lib/features/data/startPageSlice";

export default function MainTabs() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  const general = useSelector((state: RootState) => state.general);
  const startPage = useSelector((state: RootState) => state.startPage);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = (params.get("type") as StartPageState["type"]) || "book";
    console.log("Type from URL:");
    dispatch(setType(type));
    dispatch(
      setTypeFromQuery(
        (params.get("type") as StartPageState["type"]) ? true : false
      )
    );
  }, [dispatch]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const goal = (params.get("goal") as StartPageState["goal"]) || "print";
    console.log("Goal from URL:");
    dispatch(setGoal(goal));
    dispatch(
      setGoalFromQuery(
        (params.get("goal") as StartPageState["goal"]) ? true : false
      )
    );
  }, [dispatch]);

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

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const demoPayload = {
    contact_email: "test@test.com",
    external_id: "demo-time",
    line_items: [
      {
        external_id: "item-reference-1",
        printable_normalization: {
          cover: {
            source_url:
              "https://www.dropbox.com/s/7bv6mg2tj0h3l0r/lulu_trade_perfect_template.pdf?dl=1&raw=1",
          },
          interior: {
            source_url:
              "https://www.dropbox.com/s/r20orb8umqjzav9/lulu_trade_interior_template-32.pdf?dl=1&raw=1",
          },
          pod_package_id: "0600X0900BWSTDPB060UW444MXX",
        },
        quantity: 30,
        title: "My Book",
      },
    ],
    production_delay: 120,
    shipping_address: {
      city: "Lübeck",
      country_code: "GB",
      name: "Hans Dampf",
      phone_number: "844-212-0689",
      postcode: "PO1 3AX",
      state_code: "",
      street1: "Holstenstr. 48",
    },
    shipping_level: "MAIL",
  };
  const createOrder = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoPayload), // just a dummy payload for now
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // createOrder();
  }, []);

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
