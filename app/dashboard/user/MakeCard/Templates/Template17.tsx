import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Template17({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - clean modern
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-8"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-6">
          <div className="space-y-3">
            <div className="text-xl font-extralight tracking-[0.2em]">
              {makeCard.companyName || "MODERN"}
            </div>
            <div
              className="w-8 h-[1px] mx-auto"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
          </div>

          <div className="text-sm font-light leading-relaxed max-w-[220px] mx-auto">
            {makeCard.companyMessage || "Simple solutions for complex problems"}
          </div>

          <div className="text-xs font-light tracking-wider">
            {makeCard.website || "MODERN.CO"}
          </div>
        </div>
      </div>
    );
  }

  // Front design - clean modern
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="space-y-3">
          <h1 className="text-xl font-extralight tracking-[0.15em]">
            {makeCard.companyName || "MODERN COMPANY"}
          </h1>
          <p className="text-xs font-light opacity-80 max-w-[220px]">
            {makeCard.companyMessage ||
              "Innovative solutions for the modern world"}
          </p>
        </div>

        <div className="space-y-4">
          <div
            className="w-12 h-[1px]"
            style={{ backgroundColor: makeCard.currentTextColor }}
          />

          <div className="space-y-2">
            <div className="text-base font-light tracking-wide">
              {makeCard.name || "Your Name"}
            </div>
            <div className="text-xs font-light tracking-wider opacity-70">
              {makeCard.jobTitle || "POSITION"}
            </div>
          </div>

          <div className="space-y-1 text-xs font-light">
            <div className="tracking-wide">
              {makeCard.email || "hello@modern.co"}
            </div>
            <div className="tracking-wide">{makeCard.phone || "Phone"}</div>
            <div className="tracking-wider opacity-70">
              {makeCard.address || "Address"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
