import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template13({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - stylish with gradient accent
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        {/* Stylish gradient overlay */}
        <div
          className="absolute top-0 right-0 w-32 h-full opacity-10"
          style={{
            background: `linear-gradient(135deg, ${makeCard.currentTextColor}, transparent)`,
          }}
        />

        <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-2xl font-light tracking-wider">
                {makeCard.companyName || "STYLISH"}
              </div>
              <div
                className="w-12 h-[1px] mx-auto"
                style={{ backgroundColor: makeCard.currentTextColor }}
              />
            </div>

            <div className="text-sm font-light italic max-w-[200px]">
              {makeCard.companyMessage || "Where style meets substance"}
            </div>

            <div className="flex justify-center space-x-6 text-xs">
              <div>✦</div>
              <div>◆</div>
              <div>✦</div>
            </div>

            <div className="text-xs font-light tracking-wide">
              {makeCard.website || "STYLISH.CO"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - very stylish with modern aesthetics
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Stylish curved accent */}
      <div
        className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-5"
        style={{ backgroundColor: makeCard.currentTextColor }}
      />
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-8"
        style={{ backgroundColor: makeCard.currentTextColor }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-lg font-light tracking-widest uppercase">
              {makeCard.companyName || "Stylish Co"}
            </h1>
            <p className="text-xs font-light opacity-80 max-w-[180px]">
              {makeCard.companyMessage || "Elevating your brand experience"}
            </p>
          </div>

          {(makeCard.companyLogo?.previewUrl ||
            typeof makeCard.companyLogo === "string") && (
            <div
              className="w-10 h-10 rounded-full overflow-hidden border border-opacity-20"
              style={{ borderColor: makeCard.currentTextColor }}
            >
              <Image
                src={
                  makeCard.companyLogo?.previewUrl ||
                  makeCard.companyLogo ||
                  "/placeholder.svg"
                }
                alt="Company Logo"
                className="object-cover w-full h-full"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div
              className="w-1 h-8"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
            <div className="space-y-1">
              <div className="text-base font-light tracking-wide">
                {makeCard.name || "Your Name"}
              </div>
              <div className="text-xs font-light opacity-70 tracking-wider uppercase">
                {makeCard.jobTitle || "Creative Director"}
              </div>
            </div>
          </div>

          <div className="ml-4 space-y-1 text-xs font-light">
            <div className="tracking-wide">
              {makeCard.email || "hello@stylish.co"}
            </div>
            <div className="tracking-wide">
              {makeCard.phone || "+1 234 567 8900"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
