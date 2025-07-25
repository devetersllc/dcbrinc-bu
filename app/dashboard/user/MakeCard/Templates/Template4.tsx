import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template4({
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
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center relative p-8"
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        <div className="w-full h-full absolute top-0 left-0 p-4 flex justify-center items-center">
          <div
            className="w-full h-full border-2"
            style={{
              borderColor:
                makeCard.currentTextColor === "black"
                  ? "gray"
                  : makeCard.currentTextColor,
              opacity: 0.3,
            }}
          ></div>
        </div>

        <div className="z-10 text-center">
          <div className="text-xl font-light mb-4">
            {makeCard.companyName || "Company Name"}
          </div>

          <div className="text-sm mb-6 font-light">
            {makeCard.companyMessage || "Professional Excellence"}
          </div>

          <div className="text-xs">{makeCard.website || "www.company.com"}</div>
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
      <div className="w-full h-full absolute top-0 left-0 p-2 flex justify-center items-center">
        <div
          className="w-full h-full border-2"
          style={{
            borderColor:
              makeCard.currentTextColor === "black"
                ? "white"
                : makeCard.currentTextColor,
          }}
        ></div>
      </div>
      <div className="flex w-[45%] h-full justify-start items-center bg-white">
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
      <div
        className="w-[55%] h-full flex justify-center items-center flex-col"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "black"
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
              {makeCard.companyName || "Company Name"}
            </span>
          </div>
          <div className="w-full flex justify-between items-center leading-0 flex-col text-xs">
            <span className="font-bold mb-1 leading-0">
              {makeCard.name || "Your Name"}
            </span>
            <span className="">{makeCard.jobTitle || "Job Title"}</span>
            <span className="">
              {makeCard.phone || makeCard.email || "Phone / Other"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
