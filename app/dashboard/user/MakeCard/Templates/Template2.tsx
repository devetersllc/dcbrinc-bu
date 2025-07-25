import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template1({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex flex-col justify-center items-center p-6"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#f5f3c6"
              : makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full">
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              color:
                makeCard.currentBgColor === "white"
                  ? "#114E89"
                  : makeCard.currentTextColor,
            }}
          >
            {makeCard.companyName || "Your Company"}
          </h2>

          <div className="text-sm mb-4 max-w-[250px] mx-auto">
            {makeCard.companyMessage || "Building tomorrow's solutions today"}
          </div>

          <div
            className="w-full h-[1px] mb-4"
            style={{
              backgroundColor:
                makeCard.currentBgColor === "white"
                  ? "#114E89"
                  : makeCard.currentTextColor,
            }}
          />

          <div className="text-xs space-y-1">
            <div>📧 {makeCard.email || "info@company.com"}</div>
            <div>🌐 {makeCard.website || "www.company.com"}</div>
          </div>
        </div>
      </div>
    );
  }

  // Front design (existing)
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black flex flex-col justify-start items-start"
      style={{
        color: makeCard.currentTextColor,
      }}
    >
      <div className="flex h-[55%] w-full justify-start items-center bg-white">
        {(makeCard.companyLogo?.previewUrl ||
          typeof makeCard.companyLogo === "string") && (
          <div className="w-1/3 ps-2">
            <Image
              src={
                makeCard.companyLogo?.previewUrl ||
                makeCard.companyLogo ||
                "/placeholder.svg"
              }
              alt="Company mascot"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
        )}
        <div className="w-2/3 p-2 flex flex-col justify-evenly h-full">
          <h1
            className="text-lg font-normal"
            style={{
              color:
                makeCard.currentBgColor === "white"
                  ? "#114E89"
                  : makeCard.currentBgColor,
            }}
          >
            {makeCard.companyName || "Your Company"}
          </h1>
          <span className="text-xs text-gray-800 font-medium">
            {makeCard.companyMessage || "Your company message"}
          </span>
        </div>
      </div>
      <div
        className="h-[45%] border-t-2 w-full p-2"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#f5f3c6"
              : makeCard.currentBgColor,
          borderColor:
            makeCard.currentBgColor === "white"
              ? "#114E89"
              : makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="flex w-full justify-between flex-col text-xs h-full">
          <span className="text-sm font-medium mb-1">
            {makeCard.name || "Your Name"}
          </span>
          <div className="w-full flex justify-between items-center">
            <span className="">{makeCard.phone || "Your phone number"}</span>
            <span className="">{makeCard.email || "Your email"}</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="">{makeCard.address || "Your address"}</span>
            <span className="">{makeCard.website || "Your website"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
