import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Template3({
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
        className="w-[336px] h-[192px] border-2 border-black flex flex-col justify-center items-center p-8"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "darkblue"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "white"
              : makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-6">
          <div>
            <div className="text-sm font-light mb-2">Visit us online</div>
            <div className="text-lg font-medium">
              {makeCard.website || "www.company.com"}
            </div>
          </div>

          <div
            className="w-16 h-[1px] mx-auto"
            style={{
              backgroundColor:
                makeCard.currentTextColor === "black"
                  ? "white"
                  : makeCard.currentTextColor,
            }}
          />

          <div className="text-xs font-light italic">
            "Quality • Innovation • Excellence"
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
      <div className="flex h-[50%] w-full justify-start items-center bg-white">
        <div className="w-full p-2 flex flex-col justify-evenly items-center h-full">
          <h1
            className="text-lg font-normal border-2 w-[80%] text-center"
            style={{
              color:
                makeCard.currentBgColor === "white"
                  ? "black"
                  : makeCard.currentBgColor,
              borderColor:
                makeCard.currentBgColor === "white"
                  ? "black"
                  : makeCard.currentBgColor,
            }}
          >
            {makeCard.companyName || "Your Company"}
          </h1>
        </div>
      </div>
      <div
        className="h-[50%] border-t-2 w-full p-2"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "darkblue"
              : makeCard.currentBgColor,
          borderColor:
            makeCard.currentBgColor === "white"
              ? "white"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "white"
              : makeCard.currentTextColor,
        }}
      >
        <div className="flex w-full justify-between flex-col text-xs h-full">
          <span className="text-sm font-medium mb-1 leading-0">
            {makeCard.name || "Your Name"} (
            <span className="-mt-2">{makeCard.jobTitle || "Job Title"}</span>)
          </span>
          <div className="w-full flex justify-between items-center leading-0 font-semibold">
            <span className="">{makeCard.email || "Your email"}</span>
            <span className="">{makeCard.address || "Your address"}</span>
          </div>
          <div className="w-full flex justify-between items-center leading-0 font-semibold">
            <span className="">{makeCard.website || "Your website"}</span>
            <span className="">{makeCard.phone || "Phone number"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
