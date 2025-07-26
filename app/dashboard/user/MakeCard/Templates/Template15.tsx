import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template15({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - gradient colorful
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden flex justify-center items-center p-6"
        style={{
          background: `linear-gradient(135deg, ${makeCard.currentBgColor}, ${makeCard.currentTextColor}15)`,
          color: makeCard.currentTextColor,
        }}
      >
        {/* Colorful accent shapes */}
        <div
          className="absolute top-4 right-4 w-8 h-8 rounded-full opacity-20"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
        <div
          className="absolute bottom-6 left-6 w-6 h-6 rounded-full opacity-15"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />

        <div className="text-center z-10 space-y-4">
          <div className="space-y-2">
            <div className="text-xl font-medium tracking-wide">
              {makeCard.companyName || "VIBRANT"}
            </div>
            <div className="text-sm font-light">
              {makeCard.companyMessage || "Bringing color to your world"}
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: makeCard.currentTextColor,
                opacity: 0.6,
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: makeCard.currentTextColor,
                opacity: 0.4,
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: makeCard.currentTextColor,
                opacity: 0.8,
              }}
            />
          </div>

          <div className="text-xs font-medium">
            {makeCard.website || "VIBRANT.DESIGN"}
          </div>
        </div>
      </div>
    );
  }

  // Front design - gradient/colorful style
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
      style={{
        background: `linear-gradient(45deg, ${makeCard.currentBgColor}, ${makeCard.currentTextColor}10)`,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Gradient overlay elements */}
      <div
        className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${makeCard.currentTextColor}, transparent 50%)`,
        }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-lg font-medium tracking-wide">
              {makeCard.companyName || "Vibrant Studio"}
            </h1>
            <p className="text-xs font-light max-w-[180px]">
              {makeCard.companyMessage ||
                "Creative solutions with vibrant energy"}
            </p>
          </div>

          {(makeCard.companyLogo?.previewUrl ||
            typeof makeCard.companyLogo === "string") && (
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
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

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div
                className="w-1 h-6 rounded-full"
                style={{
                  backgroundColor: makeCard.currentTextColor,
                  opacity: 0.8,
                }}
              />
              <div
                className="w-1 h-4 rounded-full"
                style={{
                  backgroundColor: makeCard.currentTextColor,
                  opacity: 0.6,
                }}
              />
              <div
                className="w-1 h-5 rounded-full"
                style={{
                  backgroundColor: makeCard.currentTextColor,
                  opacity: 0.4,
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-base font-medium">
                {makeCard.name || "Your Name"}
              </div>
              <div className="text-xs font-light opacity-80">
                {makeCard.jobTitle || "Creative Director"}
              </div>
            </div>
          </div>

          <div className="ml-6 space-y-1 text-xs">
            <div>{makeCard.email || "hello@vibrant.design"}</div>
            <div>{makeCard.phone || "Phone"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
