import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Template11({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - classic elegant
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
            <div className="text-xl font-serif">
              {makeCard.companyName || "Elegant Co."}
            </div>
            <div
              className="w-16 h-[2px] mx-auto"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
            <div className="text-sm font-light italic">
              {makeCard.companyMessage || "Timeless excellence"}
            </div>
          </div>

          <div className="text-xs space-y-1">
            <div className="font-serif">
              {makeCard.website || "www.elegant.com"}
            </div>
            <div className="font-light">Est. 2024</div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - classic elegant with serif fonts
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      <div className="p-6 h-full flex flex-col justify-center">
        <div className="text-center space-y-2">
          <div className="space-y-1">
            <h1 className="text-xl font-serif">
              {makeCard.companyName || "Elegant Company"}
            </h1>
            <div
              className="w-20 h-[1px] mx-auto"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
            <p className="text-xs font-light italic">
              {makeCard.companyMessage || "Distinguished service since 2024"}
            </p>
          </div>

          <div className="space-y-">
            <div className="text-lg font-serif">
              {makeCard.name || "Your Name"}
            </div>
            <div className="text-sm font-light">
              {makeCard.jobTitle || "Position"}
            </div>

            <div className="space-y-1 text-xs">
              <div>{makeCard.phone || "Phone Number"}</div>
              <div>{makeCard.email || "Email Address"}</div>
              <div className="font-light">
                {makeCard.address || "Business Address"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
