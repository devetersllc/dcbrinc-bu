"use client";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useFieldsEmptyCheck } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/lib/features/general/general";

const colorsArray: string[] = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-orange-200",
  "bg-gray-200",
];

const textColorsArray: string[] = [
  "text-red-800",
  "text-blue-600",
  "text-green-600",
  "text-yellow-500",
  "text-purple-500",
  "text-pink-400",
  "text-orange-600",
  "text-gray-700",
];

export default function MakeCard() {
  const dispatch = useDispatch();
  const general = useSelector((state: RootState) => state.general);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  useFieldsEmptyCheck(makeCard);
  console.log("makeCard", makeCard);

  const handleSubmit = () => {
    dispatch(setActiveTab(general.activeTab + 1));
  };

  return (
    <>
      <div className="bg-white w-full flex flex-wrap gap-[20px] mx-auto p-6 rounded-lg border-2 my-2">
        <div className="w-full xl:w-[calc(60%-10px)] p-4 rounded-lg border-2 flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label
                htmlFor="company-logo"
                className="text-xs font-semibold uppercase"
              >
                Company Logo
              </Label>
            </div>
            <Input
              type="file"
              id="company-logo"
              placeholder="Enter Company Logo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  dispatch(setImageUrl({ file, previewUrl }));
                }
              }}
              className="border-gray-300"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Company Name
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyName.length} / 50
                </span>
              </div>
              <Input
                id="company-name"
                value={makeCard.companyName}
                placeholder="Enter Company Name"
                onChange={(e) => dispatch(setCompanyName(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Company Message
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyMessage.length} / 50
                </span>
              </div>
              <Input
                id="company-message"
                value={makeCard.companyMessage}
                placeholder="Enter Company Message"
                onChange={(e) => dispatch(setCompanyMessage(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase"
                >
                  Your Name
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.companyName.length} / 50
                </span>
              </div>
              <Input
                id="name"
                value={makeCard.name}
                placeholder="Enter Your Name"
                onChange={(e) => dispatch(setName(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase"
                >
                  Your Email
                </Label>
              </div>
              <Input
                id="email"
                value={makeCard.email}
                placeholder="Enter Your Email"
                onChange={(e) => dispatch(setEmail(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="company-name"
                  className="text-xs font-semibold uppercase"
                >
                  Job Title
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.jobTitle.length} / 50
                </span>
              </div>
              <Input
                id="job-title"
                value={makeCard.jobTitle}
                placeholder="Enter Job Title"
                onChange={(e) => dispatch(setJobTitle(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="website"
                  className="text-xs font-semibold uppercase"
                >
                  Website Url
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.website?.length} / 50
                </span>
              </div>
              <Input
                id="website"
                value={makeCard.website}
                placeholder="Enter Website Url"
                onChange={(e) => dispatch(setWebsite(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase"
                >
                  Phone
                </Label>
              </div>
              <Input
                id="phone"
                value={makeCard.phone}
                placeholder="Enter Your Phone"
                type="number"
                onChange={(e) => dispatch(setPhone(e.target.valueAsNumber))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-1">
                <Label
                  htmlFor="address"
                  className="text-xs font-semibold uppercase"
                >
                  Address
                </Label>
                <span className="text-xs text-gray-500">
                  {makeCard.address.length} / 50
                </span>
              </div>
              <Input
                id="address"
                value={makeCard.address}
                placeholder="Enter Company Address"
                onChange={(e) => dispatch(setAddress(e.target.value))}
                className="border-gray-300"
                maxLength={50}
              />
            </div>
          </div>
        </div>
        <CardPreview />
      </div>

      <Button
        disabled={general.areFieldsEmptyCheck}
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleSubmit}
      >
        Review Card
      </Button>
    </>
  );
}

import { toPng } from "html-to-image";
import download from "downloadjs";
import { useRef } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  setAddress,
  setCompanyMessage,
  setCompanyName,
  setCurrentBgColor,
  setCurrentTextColor,
  setEmail,
  setImageUrl,
  setJobTitle,
  setName,
  setPhone,
  setWebsite,
} from "@/lib/features/data/makeCard";
import { Download } from "lucide-react";

export function CardPreview({ hideActions = false }) {
  const divRef = useRef<HTMLDivElement>(null);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  const dispatch = useDispatch();

  const handleDownload = async () => {
    if (divRef.current === null) return;

    const dataUrl = await toPng(divRef.current);
    download(dataUrl, "downloaded-div.png");
  };

  return (
    <div className="relative w-full xl:w-[calc(40%-10px)] p-4 rounded-lg border-2 flex flex-col justify-start items-start overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div
        ref={divRef}
        className={`w-[336px] h-[192px] px-3 border-2 border-black ${makeCard.currentBgColor} ${makeCard.currentTextColor} `}
      >
        <div className="flex items-center justify-start pt-4 w-fit h-fit gap-2">
          <div className="flex items-center justify-center w-[50px] h-[50px] rounded">
            {makeCard.imageUrl?.previewUrl ? (
              <Image
                src={makeCard.imageUrl?.previewUrl}
                alt="Company Logo"
                className="object-contain h-full w-full"
                width={500}
                height={300}
              />
            ) : (
              <div className="border-2 border-solid border-black w-full h-full bg-white"></div>
            )}
          </div>
          <div className="flex flex-col gap-0 ">
            <span className="text-sm font-semibold">
              {makeCard.companyName || "Company Name"}
            </span>
            <span className="text-xs font-extralight italic">
              {makeCard.companyMessage || "Company Message"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end pt-2 w-full h-fit gap-2 ">
          <div className="flex flex-col gap-0 items-end">
            <span className="text-sm font-normal">
              {makeCard.name || "Your Name"}
            </span>
            <span className="text-xs font-extralight">
              {makeCard.jobTitle || "Your Job Title"}
            </span>
            <span className="text-xs font-extralight">
              {makeCard.email || "Your Email"}
            </span>
          </div>
        </div>
        <div className="border-[1px] border-black mt-2 rounded-full"></div>
        <div className="flex items-center justify-start pt-2 w-full h-fit gap-2">
          <div className="flex flex-col gap-0 items-start w-full">
            <span className="text-xs font-normal">
              {makeCard.address || "Your Address"}
            </span>
            <div className="w-full flex justify-between items-center">
              <span className="text-xs font-normal">
                {makeCard.phone || "Your Phone"}
              </span>
              {makeCard.website && (
                <span className="text-xs font-normal">
                  {makeCard.website || "Your Website"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {!hideActions && (
        <div className="flex flex-col justify-start items-start w-full">
          <div className=" w-full h-fit mt-6 flex items-center justify-start gap-2 overflow-auto">
            {colorsArray.map((color, index) => (
              <div
                className={`w-[30px] h-[30px] rounded-full ${color}`}
                onClick={() => {
                  dispatch(setCurrentBgColor(color));
                }}
              ></div>
            ))}
          </div>

          <div className=" w-full h-fit mt-6 flex items-center justify-start gap-2 overflow-auto">
            {textColorsArray.map((color, index) => (
              <div
                className={`w-[30px] h-[30px] rounded-full ${color.replaceAll(
                  "text-",
                  "bg-"
                )}`}
                onClick={() => {
                  dispatch(setCurrentTextColor(color));
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full"
      >
        <Download />
      </button>
    </div>
  );
}
