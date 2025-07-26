import type { RootState } from "@/lib/store";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template6({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-6"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#A35C48"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "white"
              : makeCard.currentTextColor,
        }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center text-center space-y-6">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-white rotate-45 clip-small-points opacity-60" />
            <div className="absolute inset-0 rotate-90 bg-white clip-small-points opacity-60" />
          </div>

          <div>
            <div className="text-lg font-medium mb-2">
              {makeCard.companyName || "Company Name"}
            </div>
            <div className="text-xs">
              {makeCard.website || "www.company.com"}
            </div>
          </div>

          <div className="text-xs font-light italic opacity-80">
            {`"`}{makeCard.companyMessage || "Crafting Excellence"}
            {`"`}
          </div>
        </div>
      </div>
    );
  }

  // Front design (existing)
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black flex justify-start items-start relative"
      style={{
        color: makeCard.currentTextColor,
        backgroundColor: makeCard.currentBgColor,
      }}
    >
      <div
        className="w-[60%] h-full flex justify-center items-center flex-col"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#A35C48"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "white"
              : makeCard.currentTextColor,
        }}
      >
        <div className="w-full h-full flex justify-evenly items-center flex-col">
          <div className="w-full flex justify-between items-center leading-0 font-semibold flex-col text-md">
            <span className="font-bold mb-1 leading-0">
              {makeCard.name || "Name"}
            </span>
            <span className="font-normal text-xs">
              {makeCard.jobTitle || "Job Title"}
            </span>
          </div>
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 bg-white rotate-45 clip-small-points" />
            <div className="absolute inset-0 rotate-90 bg-white clip-small-points" />
          </div>
          <div className="w-full flex justify-between items-center leading-relaxed flex-col text-xs">
            <span className="">{makeCard.phone || "Phone / Other"}</span>
            <span className="">{makeCard.website || "Web / Other"}</span>
            <span className="">{makeCard.email || "Email / Other"}</span>
          </div>
        </div>
      </div>
      <div className="flex w-[40%] h-full justify-start items-center bg-white">
        {(makeCard.companyLogo?.previewUrl ||
          typeof makeCard.companyLogo === "string") && (
          <div className="w-full h-full">
            <Image
              src={
                makeCard.companyLogo?.previewUrl ||
                makeCard.companyLogo ||
                "/placeholder.svg"
              }
              alt="Company mascot"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
