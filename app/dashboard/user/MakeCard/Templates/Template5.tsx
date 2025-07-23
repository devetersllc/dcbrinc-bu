import { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template5({ divRef }: { divRef?: any }) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black flex justify-start items-start relative"
      style={{
        color: makeCard.currentTextColor,
        backgroundColor: makeCard.currentBgColor,
      }}
    >
      <div className="flex w-[35%] h-full justify-start items-center bg-white">
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
        className="w-[65%] h-full flex justify-center items-center flex-col"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "gray"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "white"
              : makeCard.currentTextColor,
        }}
      >
        <div className="w-full h-full flex justify-evenly items-start flex-col">
          <div className="w-full flex justify-between ps-2 leading-0 font-semibold flex-col text-md">
            <span className="font-bold mb-1 leading-0">
              {makeCard.companyName || "Company Name"}
            </span>
          </div>
          <div className="w-full flex justify-between ps-2 leading-0 flex-col text-xs">
            <span className="mb-2 leading-0">
              {makeCard.website || "Web / Other"}
            </span>
            <div
              className="w-[30px] border-t-[1px] mb-2"
              style={{
                borderColor:
                  makeCard.currentTextColor === "black"
                    ? "white"
                    : makeCard.currentTextColor,
              }}
            ></div>
            <span className="leading-0">
              {makeCard.name || "Your Name"}
            </span>
            <span className="italic">{makeCard.jobTitle || "Job Title"}</span>
            <span className="mb-2 leading-0">{makeCard.email || "Email"}</span>
            <span className="">
              {makeCard.address || "Address"}
            </span>
            <span className="">
              {makeCard.phone || "Phone / Other"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
