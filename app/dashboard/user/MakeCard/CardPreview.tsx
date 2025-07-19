"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  setCurrentBgColor,
  setCurrentTextColor,
} from "@/lib/features/data/makeCard";
import { Download, PaintBucket, PenLine, Text, Type } from "lucide-react";

const colorsArray: string[] = [
  "#1A1A1A",
  "#0D47A1",
  "#2C3E50",
  "#34495E",
  "#ECECEC",
  "#004D40",
  "#3E2723",
  "#B71C1C",
  "#263238",
];

const textColorsArray: string[] = [
  "#000000",
  "#212121",
  "#333333",
  "#F5F5F5",
  "#BDBDBD",
  "#E0E0E0",
  "#FFD700",
  "#1976D2",
  "#C62828",
];

export default function CardPreview({ hideActions = false }) {
  const divRef = useRef<HTMLDivElement>(null);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  const dispatch = useDispatch();
  const [textCustomColor, setTextCustomColor] = useState<string>("");
  const [bgCustomColor, setBgCustomColor] = useState<string>("");

  const handleDownload = async () => {
    if (divRef.current === null) return;

    const dataUrl = await toPng(divRef.current);
    download(dataUrl, "downloaded-div.png");
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: typeof setCurrentBgColor | typeof setCurrentTextColor,
    setStateCustomColor: (color: string) => void
  ) => {
    console.log("e.target.value", e.target.value);
    setStateCustomColor(e.target.value);
    dispatch(setState(e.target.value));
  };

  return (
    <div className="relative w-full xl:w-[calc(40%-10px)] p-4 rounded-lg border-2 flex flex-col justify-start items-start overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div
        ref={divRef}
        className={`w-[336px] h-[192px] px-3 border-2 border-black`}
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="flex items-center justify-start pt-4 w-fit h-fit gap-2">
          {makeCard.imageUrl?.previewUrl && (
            <div className="flex items-center justify-center max-w-[50px] max-h-[50px] rounded">
              <Image
                src={makeCard.imageUrl?.previewUrl}
                alt="Company Logo"
                className="object-contain h-full w-full"
                width={500}
                height={300}
              />
            </div>
          )}
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
        <div
          className="h-[1px] w-full mt-2 rounded-full"
          style={{
            background: `linear-gradient(135deg,transparent, ${makeCard.currentTextColor}, transparent)`,
          }}
        ></div>
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
            <PaintBucket />
            <div
              className={`w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center`}
              style={{
                background: `linear-gradient(135deg, ${
                  bgCustomColor || "#000000"
                }, white)`,
              }}
            >
              <input
                type="color"
                onChange={(event) => {
                  handleChange(event, setCurrentBgColor, setBgCustomColor);
                }}
                className="w-[150%] h-[150%] rounded-full border-none outline-none opacity-0"
              />
            </div>
            {colorsArray.map((color, index) => (
              <div
                key={index}
                className={`w-[30px] h-[30px] rounded-full cursor-pointer`}
                onClick={() => {
                  dispatch(setCurrentBgColor(color));
                }}
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>

          <div className=" w-full h-fit mt-6 flex items-center justify-start gap-2 overflow-auto">
            <PenLine size={20} />
            <div
              className={`w-[30px] h-[30px] rounded-full overflow-hidden flex items-center justify-center`}
              style={{
                background: `linear-gradient(135deg, ${
                  textCustomColor || "#000000"
                }, white)`,
              }}
            >
              <input
                type="color"
                onChange={(event) => {
                  handleChange(event, setCurrentTextColor, setTextCustomColor);
                }}
                className="w-[150%] h-[150%] rounded-full border-none outline-none opacity-0"
              />
            </div>
            {textColorsArray.map((color, index) => (
              <div
                key={index}
                className={`w-[30px] h-[30px] rounded-full cursor-pointer`}
                onClick={() => {
                  dispatch(setCurrentTextColor(color));
                }}
                style={{ backgroundColor: color }}
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
