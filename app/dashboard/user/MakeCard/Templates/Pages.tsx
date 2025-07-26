import { useDispatch, useSelector } from "react-redux";
import Template1 from "./Template2";
import Template2 from "./Template1";
import Template3 from "./Template3";
import { setSelectedCard } from "@/lib/features/data/makeCard";
import Template4 from "./Template4";
import { RootState } from "@/lib/store";
import Template5 from "./Template5";
import Template6 from "./Template6";
import Template7 from "./Template7";
import Template8 from "./Template8";
import Template9 from "./Template9";
import Template10 from "./Template10";
import Template11 from "./Template11";
import Template12 from "./Template12";
import Template13 from "./Template13";
import Template14 from "./Template14";
import Template15 from "./Template15";
import Template16 from "./Template16";
import Template17 from "./Template17";
import Template18 from "./Template18";

const templates = [
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
  // Template10,
  Template11,
  Template12,
  Template13,
  Template14,
  Template15,
  Template16,
  // Template17,
  Template18,
];

const AllTemplates = () => {
  const dispatch = useDispatch();
  return (
    <div className="w-full h-fit p-4 border-2 rounded-md flex justify-start items-start gap-y-5 gap-x-[3%] flex-wrap">
      {templates.map((Template, index) => (
        <div
          className="h-fit cursor-pointer min-w-[31%] flex justify-center items-center border-2 rounded-lg p-4"
          onClick={() => {
            dispatch(setSelectedCard(index));
          }}
        >
          <Template />
        </div>
      ))}
    </div>
  );
};

export default AllTemplates;
