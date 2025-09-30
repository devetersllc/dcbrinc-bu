"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setGoal, StartPageState } from "@/lib/features/data/startPageSlice";
import { useMemo } from "react";
interface OptionsType {
  value: "print" | "publish";
  text:
    | "Upload your Book files to your account and purchase copies."
    | "Publish your Book to use any or all of our retail options to sell your Book.";
}

export function GoalSelection() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const dispatch = useDispatch();

  const products: OptionsType[] = [
    {
      value: "print",
      text: "Upload your Book files to your account and purchase copies.",
    },
    {
      value: "publish",
      text: "Publish your Book to use any or all of our retail options to sell your Book.",
    },
  ];
  const transformedArray = useMemo(() => {
    if (startPage.goalFromQuery) {
      return products.filter((product) => product.value === startPage.goal);
    } else {
      return products;
    }
  }, [startPage.goalFromQuery]);

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
      <RadioGroup
        value={startPage.goal}
        onValueChange={(e: StartPageState["goal"]) => {
          dispatch(setGoal(e));
        }}
        className="space-y-4"
      >
        {transformedArray.map((item) => (
          <div
            className={`border rounded-lg overflow-hidden ${
              startPage.goal === item.value
                ? "border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex items-start p-4 bg-gray-100">
              <RadioGroupItem
                value={item.value}
                id={item.value}
                className="mt-1"
              />
              <div className="ml-3">
                <Label
                  htmlFor={item.value}
                  className="font-bold text-base cursor-pointer capitalize"
                >
                  {item.value === "publish" ? (
                    <>Publish Your {startPage.type?.replaceAll("-", " ")}</>
                  ) : (
                    <>
                      {startPage.type === "print-book" ? "Get " : "Print "}
                      Your {startPage.type?.replaceAll("-", " ")}
                    </>
                  )}
                </Label>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

// {expanded && selectedGoal === "publish" && (
//   <div className="border-t px-4 py-3">
//     <div className="space-y-3">
//       <div className="p-3 border rounded-md bg-white">
//         <div className="flex items-start">
//           <Checkbox
//             id="lulu-bookstore"
//             checked={selectedOptions.includes("lulu-bookstore")}
//             onCheckedChange={() =>
//               handleOptionChange("lulu-bookstore")
//             }
//             className="mt-1"
//           />
//           <div className="ml-3">
//             <Label
//               htmlFor="lulu-bookstore"
//               className="font-bold text-sm cursor-pointer"
//             >
//               DCBRINC Bookstore
//             </Label>
//             <p className="text-sm text-gray-600">
//               Sell your Book on the DCBRINC Bookstore.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-3 border rounded-md bg-gray-100">
//         <div className="flex items-start">
//           <Checkbox
//             id="lulu-direct"
//             checked={selectedOptions.includes("lulu-direct")}
//             onCheckedChange={() =>
//               handleOptionChange("lulu-direct")
//             }
//             className="mt-1"
//           />
//           <div className="ml-3">
//             <Label
//               htmlFor="lulu-direct"
//               className="font-bold text-sm cursor-pointer"
//             >
//               DCBRINC Direct
//             </Label>
//             <p className="text-sm text-gray-600">
//               Sell your Book on your website or ecommerce store.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="p-3 border rounded-md bg-gray-100">
//         <div className="flex items-start">
//           <Checkbox
//             id="global-distribution"
//             checked={selectedOptions.includes(
//               "global-distribution"
//             )}
//             onCheckedChange={() =>
//               handleOptionChange("global-distribution")
//             }
//             className="mt-1"
//           />
//           <div className="ml-3 flex-1">
//             <div className="flex items-center gap-1">
//               <Label
//                 htmlFor="global-distribution"
//                 className="font-bold text-sm cursor-pointer"
//               >
//                 Global Distribution
//               </Label>
//               <InfoIcon className="h-4 w-4 text-purple-500" />
//             </div>
//             <p className="text-sm text-gray-600">
//               Sell your Book through 40,000+ global retailers using
//               DCBRINC's distribution service. Please note that a
//               title page, copyright page, and ISBN are required.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
