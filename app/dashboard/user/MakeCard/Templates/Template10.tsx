import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export default function Template10({
  divRef,
  isFront = true,
}: {
  divRef?: any;
  isFront?: boolean;
}) {
  const makeCard = useSelector((state: RootState) => state.makeCard);

  if (!isFront) {
    // Back design - tech focused
    return (
      <div
        ref={divRef}
        className="w-[336px] h-[192px] border-2 border-black flex justify-center items-center p-6"
        style={{
          backgroundColor:
            makeCard.currentBgColor === "white"
              ? "#1a1a1a"
              : makeCard.currentBgColor,
          color:
            makeCard.currentTextColor === "black"
              ? "#00ff88"
              : makeCard.currentTextColor,
        }}
      >
        <div className="text-center w-full space-y-4">
          <div className="font-mono">
            <div className="text-sm mb-2">
              {"<"}
              {makeCard.companyName || "TechCorp"}
              {">"}
            </div>
            <div className="text-xs font-light">
              {"// "}
              {makeCard.companyMessage || "Building the future"}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div>API</div>
            <div>WEB</div>
            <div>APP</div>
          </div>

          <div className="text-xs font-mono">
            <div>
              {"> "}
              {makeCard.website || "tech.dev"}
            </div>
            <div className="mt-1 opacity-70">{"// Always innovating"}</div>
          </div>
        </div>
      </div>
    );
  }

  // Front design - tech/developer style
  return (
    <div
      ref={divRef}
      className="w-[336px] h-[192px] border-2 border-black relative"
      style={{
        backgroundColor:
          makeCard.currentBgColor === "white"
            ? "#1a1a1a"
            : makeCard.currentBgColor,
        color:
          makeCard.currentTextColor === "black"
            ? "#00ff88"
            : makeCard.currentTextColor,
      }}
    >
      <div className="p-4 h-full flex flex-col justify-between font-mono">
        <div className="space-y-2">
          <div className="text-xs opacity-70">{"// Company"}</div>
          <div className="text-lg">{makeCard.companyName || "TechCorp"}</div>
          <div className="text-xs opacity-80">
            {"/* "}
            {makeCard.companyMessage || "Innovation in code"}
            {" */"}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs opacity-70">{"// Contact"}</div>
          <div className="text-sm">const dev = {"{"}</div>
          <div className="text-xs ml-4">
            name: "{makeCard.name || "Developer"}",
          </div>
          <div className="text-xs ml-4">
            role: "{makeCard.jobTitle || "Software Engineer"}",
          </div>
          <div className="text-xs ml-4">
            email: "{makeCard.email || "dev@tech.com"}",
          </div>
          <div className="text-xs ml-4">
            phone: "{makeCard.phone || "Phone"}"
          </div>
          <div className="text-sm">{"}"}</div>
        </div>

        {/* Terminal cursor */}
        <div
          className="absolute bottom-4 right-4 w-2 h-4 animate-pulse"
          style={{ backgroundColor: makeCard.currentTextColor }}
        />
      </div>
    </div>
  );
}
