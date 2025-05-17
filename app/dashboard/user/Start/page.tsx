"use client";
import { ProductSelection } from "./product-selection";
import { GoalSelection } from "./goal-selection";
import { PhotoBookDetails } from "./photo-book-details";
import { Button } from "@/components/ui/button";
import { useFieldsEmptyCheck } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/lib/features/general/general";

export default function Start() {
  const dispatch = useDispatch();
  const general = useSelector((state: RootState) => state.general);
  const startPage = useSelector((state: RootState) => state.startPage);
  useFieldsEmptyCheck(startPage);

  const handleSubmit = () => {
    dispatch(setActiveTab(general.activeTab + 1));
  };

  return (
    <>
      <ProductSelection />
      <GoalSelection />
      <PhotoBookDetails />
      <Button
        disabled={general.areFieldsEmptyCheck}
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleSubmit}
      >
        Add Design Info
      </Button>
    </>
  );
}
