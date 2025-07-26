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
