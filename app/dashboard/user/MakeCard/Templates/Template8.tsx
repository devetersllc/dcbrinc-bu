import type { RootState } from "@/lib/store";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template8({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - corporate professional
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex flex-col justify-center items-center p-6"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#f8f9fa"
              : makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {makeCard.companyName || "Company Name"}
            </h2>
          </div>

          <div
            className="w-full h-[1px] my-3"
            style={{ backgroundColor: makeCard.currentTextColor, opacity: 0.3 }}
          />

          <div className="text-xs">
            <div>{makeCard.website || "www.company.com"}</div>
            <div className="mt-1 font-light">{makeCard?.companyMessage || "Excellence in every detail"}</div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - corporate with header bar
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black flex flex-col"
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      {/* Header bar */}
      <div
        className="h-8 w-full flex items-center px-4"
        style={{
          backgroundColor: makeCard.currentTextColor,
          color: makeCard.currentBgColor,
        }}
      >
        <div className="text-xs font-medium">
          {makeCard.companyName || "COMPANY NAME"}
        </div>
      </div>

      <div className="flex-1 p-4 flex justify-between">
        <div className="flex-1 space-y-3">
          <div>
            <div className="text-lg font-semibold">
              {makeCard.name || "Your Name"}
            </div>
            <div className="text-sm font-light">
              {makeCard.jobTitle || "Job Title"}
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div>📞 {makeCard.phone || "Phone"}</div>
            <div>✉️ {makeCard.email || "Email"}</div>
            <div>🌐 {makeCard.website || "Website"}</div>
            <div>📍 {makeCard.address || "Address"}</div>
          </div>
        </div>

        {(makeCard.companyLogo?.previewUrl ||
          typeof makeCard.companyLogo === "string") && (
          <div className="w-16 h-16 ml-4">
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
        )}
      </div>
    </div>
  );
}
