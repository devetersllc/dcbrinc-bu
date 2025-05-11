"use client";


import { ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setCopyrightHolder, setCopyrightOption, setCopyrightYear } from "@/lib/features/data/copyWriteSlice";

export default function ContributorsCopyrightForm() {
  const dispatch = useDispatch();
  const copyWrite = useSelector((state: RootState) => state.copyWrite);

  const [expandedSections, setExpandedSections] = useState({
    allRights: true,
    creativeCommons: false,
    publicDomain: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="space-y-6">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Copyright</h2>
            <div className="max-w-md">
              <p className="text-sm text-gray-600">
                Select the copyright license that best suits your work. For more
                information about copyright, please see{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Copyright Office FAQ
                </a>
              </p>
            </div>
          </div>

          <RadioGroup
            value={copyWrite.copyrightOption}
            onValueChange={(val) =>
              dispatch(
                setCopyrightOption(
                  val as "all-rights" | "creative-commons" | "public-domain"
                )
              )
            }
            className="space-y-2"
          >
            {/* All Rights Reserved Option */}
            <div className="border rounded-md overflow-hidden">
              <div
                className={`border-l-4 ${
                  copyWrite.copyrightOption === "all-rights"
                    ? "border-l-green-500"
                    : "border-l-transparent"
                }`}
              >
                <div className="p-4 flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <RadioGroupItem
                      value="all-rights"
                      id="all-rights"
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="all-rights" className="font-medium">
                        All Rights Reserved - Standard Copyright License
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        All Rights Reserved licensing. Your work cannot be
                        distributed, remixed, or otherwise used without your
                        express consent.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSection("allRights")}
                    className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                  >
                    {expandedSections.allRights ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {expandedSections.allRights && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">
                          Copyright Holder Name (Optional)
                        </label>
                        <Input
                          value={copyWrite.copyrightHolder}
                          onChange={(e) =>
                            dispatch(setCopyrightHolder(e.target.value))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase font-semibold text-gray-700 mb-1 block">
                          Copyright Year (Optional)
                        </label>
                        <Input
                          value={copyWrite.copyrightYear}
                          onChange={(e) =>
                            dispatch(setCopyrightYear(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Creative Commons Option */}
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="creative-commons"
                    id="creative-commons"
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="creative-commons" className="font-medium">
                      Some Rights Reserved - Creative Commons (CC BY)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Some rights are reserved, based on the specific Creative
                      Commons Licensing you select.{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        What is Creative Commons?
                      </a>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection("creativeCommons")}
                  className="bg-blue-900 text-white p-1 rounded"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Public Domain Option */}
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="public-domain"
                    id="public-domain"
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="public-domain" className="font-medium">
                      No Rights Reserved - Public Domain
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      No rights are reserved and the work is freely available
                      for anyone to use, distribute, and alter in any way.
                      Public Domain works are not eligible for Global
                      Distribution.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection("publicDomain")}
                  className="bg-blue-900 text-white p-1 rounded"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
