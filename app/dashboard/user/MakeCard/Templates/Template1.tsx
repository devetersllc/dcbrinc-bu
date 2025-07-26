import type { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Template2({
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
        className={`w-[336px] h-[192px] px-6 py-8 border-2 border-black flex flex-col justify-center items-center`}
        style={{
          backgroundColor: makeCard.currentBgColor,
          color: makeCard.currentTextColor,
        }}
      >
        {(makeCard.companyLogo?.previewUrl ||
          typeof makeCard.companyLogo === "string") && (
          <div className="flex items-center justify-center w-16 h-16 mb-4 opacity-20">
            <Image
              src={
                makeCard.companyLogo?.previewUrl ||
                makeCard.companyLogo ||
                "/placeholder.svg"
              }
              alt="Company Logo"
              className="object-contain h-full w-full"
              width={500}
              height={300}
            />
          </div>
        )}

        <div className="text-center">
          <div className="text-lg font-light mb-2">
            {makeCard.companyMessage || "Excellence in Every Detail"}
          </div>
          <div
            className="w-12 h-[1px] mx-auto mb-3"
            style={{ backgroundColor: makeCard.currentTextColor }}
          />
          <div className="text-xs font-light">
            {makeCard.website || "www.company.com"}
          </div>
        </div>
      </div>
    );
  }

  // Front design (existing)
  return (
    <div
      ref={divRef}
      className={`w-[336px] h-[192px] px-3 border-2 border-black`}
      style={{
        backgroundColor: makeCard.currentBgColor,
        color: makeCard.currentTextColor,
      }}
    >
      <div className="flex items-center justify-start pt-4 w-fit h-fit gap-2">
        {(makeCard.companyLogo?.previewUrl ||
          typeof makeCard.companyLogo === "string") && (
          <div className="flex items-center justify-center max-w-[50px] max-h-[50px] rounded">
            <Image
              src={
                makeCard.companyLogo?.previewUrl ||
                makeCard.companyLogo ||
                "/placeholder.svg"
              }
              alt="Company Logo"
              className="object-contain h-full w-full"
              width={500}
              height={300}
            />
          </div>
        )}
        <div className="flex flex-col gap-0 ">
          <span className="text-sm font-semibold">
            {makeCard.companyName || "Company Name"}
          </span>
          <span className="text-xs font-extralight italic">
            {makeCard.companyMessage || "Company Message"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end pt-2 w-full h-fit gap-2 ">
        <div className="flex flex-col gap-0 items-end">
          <span className="text-sm font-normal">
            {makeCard.name || "Your Name"}
          </span>
          <span className="text-xs font-extralight">
            {makeCard.jobTitle || "Your Job Title"}
          </span>
          <span className="text-xs font-extralight">
            {makeCard.email || "Your Email"}
          </span>
        </div>
      </div>
      <div
        className="h-[1px] w-full mt-2 rounded-full"
        style={{
          background: `linear-gradient(135deg,transparent, ${makeCard.currentTextColor}, transparent)`,
        }}
      ></div>
      <div className="flex items-center justify-start pt-2 w-full h-fit gap-2">
        <div className="flex flex-col gap-0 items-start w-full">
          <span className="text-xs font-normal">
            {makeCard.address || "Your Address"}
          </span>
          <div className="w-full flex justify-between items-center">
            <span className="text-xs font-normal">
              {makeCard.phone || "Your Phone"}
            </span>
            {makeCard.website && (
              <span className="text-xs font-normal">
                {makeCard.website || "Your Website"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
