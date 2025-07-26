import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template12({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - bold contemporary
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
        style={{
          backgroundColor: makeCard.currentTextColor,
          color: makeCard.currentBgColor,
        }}
      >
        {/* Bold geometric shapes */}
        <div
          className="absolute top-0 left-0 w-16 h-16 rotate-45 -translate-x-8 -translate-y-8 opacity-20"
          style={{ backgroundColor: makeCard.currentBgColor }}
        />
        <div
          className="absolute bottom-0 right-0 w-12 h-12 rotate-45 translate-x-6 translate-y-6 opacity-30"
          style={{ backgroundColor: makeCard.currentBgColor }}
        />

        <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              {makeCard.companyName || "BOLD CO"}
            </div>
            <div className="text-sm font-light max-w-[200px]">
              {makeCard.companyMessage || "Making bold moves"}
            </div>

            <div
              className="w-8 h-1 mx-auto"
              style={{ backgroundColor: makeCard.currentBgColor }}
            />

            <div className="text-xs font-medium">
              {makeCard.website || "BOLD.COM"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - bold contemporary with strong contrast
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black flex"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      <div className="w-2/3 p-5 flex flex-col justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            {makeCard.companyName || "Bold Company"}
          </h1>
          <p className="text-xs font-light">
            {makeCard.companyMessage || "Bold solutions for bold businesses"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-lg font-bold">
            {makeCard.name || "YOUR NAME"}
          </div>
          <div className="text-sm font-medium">
            {makeCard.jobTitle || "POSITION"}
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-medium">{makeCard.email || "EMAIL"}</div>
            <div className="font-medium">{makeCard.phone || "PHONE"}</div>
          </div>
        </div>
      </div>

      <div
        className="w-1/3 flex items-center justify-center"
        style={{
          backgroundColor: makeCard.currentTextColor,
          color: makeCard.currentBgColor,
        }}
      >
        {makeCard.companyLogo?.previewUrl ||
        typeof makeCard.companyLogo === "string" ? (
          <div className="w-16 h-16">
            <Image
              src={
                makeCard.companyLogo?.previewUrl ||
                makeCard.companyLogo ||
                "/placeholder.svg"
              }
              alt="Company Logo"
              className="object-contain w-full h-full"
              width={64}
              height={64}
            />
          </div>
        ) : (
          <div className="text-4xl font-bold">
            {(makeCard.companyName || "BC").charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
}
