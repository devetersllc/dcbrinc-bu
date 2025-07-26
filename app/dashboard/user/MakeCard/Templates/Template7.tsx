import type { RootState } from "@/lib/store";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template7({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - modern minimalist
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-8"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="w-full text-center space-y-6">
          <div className="space-y-2">
            <div className="text-2xl font-thin">
              {makeCard.companyName || "Company"}
            </div>
            <div
              className="w-24 h-[1px] mx-auto"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
          </div>

          <div className="text-sm font-light max-w-[200px] mx-auto">
            {makeCard.companyMessage || "Innovation through simplicity"}
          </div>

          <div className="text-xs space-y-1">
            <div>{makeCard.website || "www.company.com"}</div>
            <div>{makeCard.email || "hello@company.com"}</div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - modern minimalist with diagonal split
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Diagonal background */}
      <div
        className="absolute top-0 right-0 w-0 h-0"
        style={{
          borderLeft: "120px solid transparent",
          borderTop: `192px solid ${makeCard.currentTextColor}`,
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-thin">
            {makeCard.companyName || "Company Name"}
          </h1>
          <p className="text-xs font-light opacity-80">
            {makeCard.companyMessage || "Company Message"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-lg font-light">
            {makeCard.name || "Your Name"}
          </div>
          <div className="text-xs font-light">
            {makeCard.jobTitle || "Job Title"}
          </div>
          <div className="text-xs mt-2">{makeCard.phone || "Phone"}</div>
          <div className="text-xs">{makeCard.email || "Email"}</div>
        </div>
      </div>
    </div>
  );
}
