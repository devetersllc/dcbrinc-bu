"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronUp } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setGoal, StartPageState } from "@/lib/features/data/startPageSlice";

export function GoalSelection() {
  const [selectedGoal, setSelectedGoal] = useState("publish");
  const [expanded, setExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "lulu-bookstore",
  ]);
  const startPage = useSelector((state: RootState) => state.startPage);
  const dispatch = useDispatch();
console.log("StartPage State:", startPage.type);

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold">Select a Goal</h2>
        </div>
        <div className="md:w-2/3">
          <p className="text-base">
            Start by telling us what you plan to do with your Book. From
            printing your own copies to selling around the world or on your own
            website, we've got you covered!
          </p>
        </div>
      </div>

      {/* <Alert className="mb-6 border-purple-500 bg-purple-50 text-purple-900">
        <InfoIcon className="h-5 w-5 text-purple-500" />
        <AlertDescription>
          Your Book is currently not eligible for Global Distribution.
        </AlertDescription>
      </Alert> */}

      <RadioGroup
        value={startPage.goal}
        onValueChange={(e: StartPageState["goal"]) => {
          dispatch(setGoal(e));
        }}
        className="space-y-4"
      >
        <div className="border rounded-lg overflow-hidden">
          <div
            className={`border rounded-lg overflow-hidden ${
              selectedGoal === "print" ? "border-l-4 border-l-blue-500" : ""
            }`}

            // className={`border-l-4 ${
            //   selectedGoal === "publish"
            //     ? "border-l-green-500"
            //     : "border-l-transparent"
            // }`}
          >
            <div className="flex items-start p-4 bg-gray-100">
              <RadioGroupItem value="publish" id="publish" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label
                  htmlFor="publish"
                  className="font-bold text-base cursor-pointer capitalize"
                >
                  Publish Your {startPage.type?.replaceAll("-", " ")}
                </Label>
                <p className="text-sm text-gray-600">
                  Publish your Book to use any or all of our retail options to
                  sell your Book.
                </p>
              </div>
              {/* <button
                onClick={() => setExpanded(!expanded)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ChevronUp
                  className={`h-5 w-5 transition-transform ${
                    expanded ? "" : "rotate-180"
                  }`}
                />
              </button> */}
            </div>

            {expanded && selectedGoal === "publish" && (
              <div className="border-t px-4 py-3">
                <div className="space-y-3">
                  <div className="p-3 border rounded-md bg-white">
                    <div className="flex items-start">
                      <Checkbox
                        id="lulu-bookstore"
                        checked={selectedOptions.includes("lulu-bookstore")}
                        onCheckedChange={() =>
                          handleOptionChange("lulu-bookstore")
                        }
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <Label
                          htmlFor="lulu-bookstore"
                          className="font-bold text-sm cursor-pointer"
                        >
                          DCBRINC Bookstore
                        </Label>
                        <p className="text-sm text-gray-600">
                          Sell your Book on the DCBRINC Bookstore.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md bg-gray-100">
                    <div className="flex items-start">
                      <Checkbox
                        id="lulu-direct"
                        checked={selectedOptions.includes("lulu-direct")}
                        onCheckedChange={() =>
                          handleOptionChange("lulu-direct")
                        }
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <Label
                          htmlFor="lulu-direct"
                          className="font-bold text-sm cursor-pointer"
                        >
                          DCBRINC Direct
                        </Label>
                        <p className="text-sm text-gray-600">
                          Sell your Book on your website or ecommerce store.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-md bg-gray-100">
                    <div className="flex items-start">
                      <Checkbox
                        id="global-distribution"
                        checked={selectedOptions.includes(
                          "global-distribution"
                        )}
                        onCheckedChange={() =>
                          handleOptionChange("global-distribution")
                        }
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-1">
                          <Label
                            htmlFor="global-distribution"
                            className="font-bold text-sm cursor-pointer"
                          >
                            Global Distribution
                          </Label>
                          <InfoIcon className="h-4 w-4 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-600">
                          Sell your Book through 40,000+ global retailers using
                          DCBRINC's distribution service. Please note that a
                          title page, copyright page, and ISBN are required.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`border rounded-lg overflow-hidden ${
            selectedGoal === "print" ? "border-l-4 border-l-blue-500" : ""
          }`}
        >
          <div className="flex items-start p-4 bg-gray-100">
            <RadioGroupItem value="print" id="print" className="mt-1" />
            <div className="ml-3">
              <Label
                htmlFor="print"
                className="font-bold text-base cursor-pointer capitalize"
              >
                Print Your {startPage.type?.replaceAll("-", " ")}
              </Label>
              <p className="text-sm text-gray-600">
                Upload your Book files to your account and purchase copies.
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
