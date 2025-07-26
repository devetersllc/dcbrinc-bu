import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template16({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - artistic designer focused
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black relative flex justify-center items-center p-6"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        {/* Artistic brush stroke effect */}
        <div
          className="absolute top-2 left-4 w-16 h-1 rotate-12 opacity-20"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
        <div
          className="absolute bottom-4 right-6 w-12 h-1 -rotate-6 opacity-15"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />

        <div className="text-center z-10 space-y-4">
          <div className="space-y-3">
            <div className="text-lg font-light italic">
              {makeCard.companyName || "Artisan Studio"}
            </div>
            <div className="text-sm font-light">
              {makeCard.companyMessage || "Crafting visual stories"}
            </div>
          </div>

          <div className="flex justify-center space-x-4 text-lg">
            <div>🎨</div>
            <div>✏️</div>
            <div>🖌️</div>
          </div>

          <div className="text-xs font-light italic">
            {makeCard.website || "artisan.studio"}
          </div>
          <div className="text-xs opacity-70">
            "Design is thinking made visual"
          </div>
        </div>
      </div>
    );
  }

  // Front design - artistic/designer focused
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative overflow-hidden"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Artistic elements */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-5"
        style={{
          background: `radial-gradient(circle, ${makeCard.currentTextColor}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: makeCard.currentTextColor }}
            />
            <h1 className="text-lg font-light italic">
              {makeCard.companyName || "Artisan Studio"}
            </h1>
          </div>
          <p className="text-xs font-light max-w-[200px] ml-4">
            {makeCard.companyMessage || "Where creativity meets craftsmanship"}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="text-base font-light">
                {makeCard.name || "Your Name"}
              </div>
              <div className="text-xs font-light italic opacity-80">
                {makeCard.jobTitle || "Creative Artist"}
              </div>
            </div>

            <div className="space-y-1 text-xs font-light">
              <div>{makeCard.email || "create@artisan.studio"}</div>
              <div>{makeCard.phone || "Phone"}</div>
            </div>
          </div>

          {(makeCard.companyLogo?.previewUrl ||
            typeof makeCard.companyLogo === "string") && (
            <div className="w-14 h-14 rounded-full overflow-hidden opacity-80">
              <Image
                src={
                  makeCard.companyLogo?.previewUrl ||
                  makeCard.companyLogo ||
                  "/placeholder.svg"
                }
                alt="Company Logo"
                className="object-cover w-full h-full"
                width={56}
                height={56}
              />
            </div>
          )}
        </div>

        {/* Artistic signature line */}
        <div
          className="absolute bottom-4 left-5 w-24 h-[1px] opacity-30"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
      </div>
    </div>
  );
}
