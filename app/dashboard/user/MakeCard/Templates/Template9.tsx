import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template9({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - creative with pattern
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black relative flex justify-center items-center p-6"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-4 left-4 w-3 h-3 rounded-full opacity-20"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
        <div
          className="absolute top-8 right-6 w-2 h-2 rounded-full opacity-30"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
        <div
          className="absolute bottom-6 left-8 w-4 h-4 rounded-full opacity-15"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
        <div
          className="absolute bottom-4 right-4 w-2 h-2 rounded-full opacity-25"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />

        <div className="text-center z-10 space-y-4">
          <div className="space-y-2">
            <div className="text-lg font-medium">
              {makeCard.companyName || "Creative Studio"}
            </div>
            <div className="text-sm font-light italic">
              {makeCard.companyMessage || "Where ideas come to life"}
            </div>
          </div>

          <div className="flex justify-center space-x-4 text-xs">
            <div>🎨</div>
            <div>💡</div>
            <div>✨</div>
          </div>

          <div className="text-xs">
            {makeCard.website || "www.creative.com"}
          </div>
        </div>
      </div>
    );
  }

  // Front design - creative with circular elements
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Large decorative circle */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: makeCard.currentTextColor }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-medium">
              {makeCard.companyName || "Creative Studio"}
            </h1>
            <p className="text-xs font-light max-w-[180px]">
              {makeCard.companyMessage || "Innovative design solutions"}
            </p>
          </div>

          {(makeCard.companyLogo?.previewUrl ||
            typeof makeCard.companyLogo === "string") && (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={
                  makeCard.companyLogo?.previewUrl ||
                  makeCard.companyLogo ||
                  "/placeholder.svg"
                }
                alt="Company Logo"
                className="object-cover w-full h-full"
                width={48}
                height={48}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
            <div className="text-sm font-medium">
              {makeCard.name || "Your Name"}
            </div>
          </div>
          <div className="text-xs font-light ml-4">
            {makeCard.jobTitle || "Creative Director"}
          </div>

          <div className="ml-4 space-y-1 text-xs">
            <div>{makeCard.email || "hello@creative.com"}</div>
            <div>{makeCard.phone || "Phone"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
