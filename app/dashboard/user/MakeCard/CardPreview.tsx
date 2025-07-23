"use client";
import { useSelector } from "react-redux";
import type React from "react";
import type { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  setCurrentBgColor,
  setCurrentTextColor,
} from "@/lib/features/data/makeCard";
import { Download, PaintBucket, PenLine } from "lucide-react";
import Template1 from "./Templates/Template2";
import Template2 from "./Templates/Template1";
import Template3 from "./Templates/Template3";
import Template4 from "./Templates/Template4";
import Template5 from "./Templates/Template5";
import Template6 from "./Templates/Template6";

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

export default function CardPreview({
  hideActions = false,
  adminPreview = false,
}: {
  hideActions?: boolean;
  adminPreview?: boolean;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const makeCard = useSelector((state: RootState) => state.makeCard);
  const dispatch = useDispatch();
  const [textCustomColor, setTextCustomColor] = useState<string>("");
  const [bgCustomColor, setBgCustomColor] = useState<string>("");

  const handleDownload = async () => {
    if (divRef.current === null) return;

    const dataUrl = await toPng(divRef.current);
    download(dataUrl, "business-card.png");
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
  const templates = [
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    Template6,
  ];
  const SelectedTemplate = useMemo(
    () => templates[makeCard.selectedCard],
    [makeCard.selectedCard]
  );
  return (
    <div
      className={`relative ${
        adminPreview ? "w-fit" : "w-full xl:w-[calc(36px+336px)]"
      } p-4 rounded-lg border-2 flex flex-col justify-start items-start overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
    >
      <SelectedTemplate divRef={divRef} />
      {!hideActions && (
        <div className="flex flex-col justify-start items-start w-full">
          <div className="w-full h-fit overflow-auto">
            <div className="w-fit h-fit mt-6 flex items-center justify-start gap-2">
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
          </div>

          <div className="w-full h-fit overflow-auto">
            <div className="w-fit h-fit mt-6 flex items-center justify-start gap-2">
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
                    handleChange(
                      event,
                      setCurrentTextColor,
                      setTextCustomColor
                    );
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
