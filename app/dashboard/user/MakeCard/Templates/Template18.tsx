import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template18({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - vintage/retro
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-6"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#f4f1e8"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "#8b4513"
              : makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-4">
          <div className="space-y-2">
            <div className="text-lg font-serif tracking-wide">
              {makeCard.companyName || "VINTAGE CO."}
            </div>
            <div className="flex justify-center space-x-2">
              <div>◊</div>
              <div>◊</div>
              <div>◊</div>
            </div>
          </div>

          <div className="text-sm font-serif italic">
            {makeCard.companyMessage || "Timeless quality since 1924"}
          </div>

          <div
            className="border border-opacity-30 p-2 inline-block"
            style={{
              borderColor:
                makeCard.currentTextColor === "black"
                  ? "#8b4513"
                  : makeCard.currentTextColor,
            }}
          >
            <div className="text-xs font-serif">
              {makeCard.website || "VINTAGE.COM"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - vintage/retro style
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative"
      style={{
        backgroundColor:
          makeCard.currentBgColor === "white"
            ? "#f4f1e8"
            : makeCard.currentBgColor,
        color:
          makeCard.currentTextColor === "black"
            ? "#8b4513"
            : makeCard.currentTextColor,
      }}
    >
      {/* Vintage border */}
      <div
        className="absolute inset-3 border-2 border-opacity-20"
        style={{
          borderColor:
            makeCard.currentTextColor === "black"
              ? "#8b4513"
              : makeCard.currentTextColor,
        }}
      />

      <div className="relative z-10 p-6 h-full flex flex-col justify-center">
        <div className="text-center space-y-1">
          <div className="space-y-">
            <h1 className="text-lg font-serif tracking-wide">
              {makeCard.companyName || "VINTAGE COMPANY"}
            </h1>
            <div className="flex justify-center space-x-1 mb-1">
              <div>◊</div>
              <div>◊</div>
              <div>◊</div>
            </div>
     
          </div>

          <div className="text-sm">{makeCard.phone || "Telephone"}</div>
          <div className="space-y-0 mt-1">
            <div className="w-full flex justify-between items-center">
              <div className="text-xs font-serif">
                {makeCard.name || "Your Name"}
              </div>
              <div className="text-xs font-serif italic">
                {makeCard.jobTitle || "Proprietor"}
              </div>
            </div>

            <div className="space-y-1 text-xs font-serif w-full">
              <div className="w-full flex justify-between items-center text-xs">
                <div>{makeCard.email || "Electronic Mail"}</div>
                <div className="italic">
                  {makeCard.address || "Business Address"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
