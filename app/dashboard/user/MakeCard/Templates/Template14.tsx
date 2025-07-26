import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Template14({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - luxury premium
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-8"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#0a0a0a"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "#d4af37"
              : makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-6">
          <div className="space-y-3">
            <div className="text-xl font-serif tracking-wider">
              {makeCard.companyName || "LUXE"}
            </div>
            <div className="flex justify-center space-x-2">
              <div
                className="w-2 h-2 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
              <div
                className="w-2 h-2 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
              <div
                className="w-2 h-2 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
            </div>
          </div>

          <div className="text-sm font-light italic">
            {makeCard.companyMessage || "Uncompromising excellence"}
          </div>

          <div className="text-xs font-serif tracking-widest">
            {makeCard.website || "LUXE.COM"}
          </div>
        </div>
      </div>
    );
  }

  // Front design - luxury/premium style
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative"
      style={{
        backgroundColor:
          makeCard.currentBgColor === "white"
            ? "#0a0a0a"
            : makeCard.currentBgColor,
        color:
          makeCard.currentTextColor === "black"
            ? "#d4af37"
            : makeCard.currentTextColor,
      }}
    >
      {/* Luxury border accent */}
      <div
        className="absolute inset-2 border border-opacity-30"
        style={{
          borderColor:
            makeCard.currentTextColor === "black"
              ? "#d4af37"
              : makeCard.currentTextColor,
        }}
      />

      <div className="relative z-10 px-6 h-full flex flex-col justify-center">
        <div className="text-center space-y-3">
          <div className="space-y-2">
            <h1 className="text-xl font-serif tracking-wider">
              {makeCard.companyName || "LUXE COMPANY"}
            </h1>
            <div className="flex justify-center space-x-1">
              <div
                className="w-1 h-1 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
              <div
                className="w-1 h-1 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
              <div
                className="w-1 h-1 rotate-45"
                style={{
                  backgroundColor:
                    makeCard.currentTextColor === "black"
                      ? "#d4af37"
                      : makeCard.currentTextColor,
                }}
              />
            </div>
          </div>

          <div className="space-y-0">
            <div className="text-lg font-serif tracking-wide">
              {makeCard.name || "Your Name"}
            </div>
            <div className="text-xs font-light tracking-widest uppercase">
              {makeCard.jobTitle || "Executive"}
            </div>

            <div className="fle justify-between items-center pace-y-1 text-xs font-light">
              <div className="tracking-wide">{makeCard.phone || "Phone"}</div>
              <div className="tracking-wide">
                {makeCard.email || "contact@luxe.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
