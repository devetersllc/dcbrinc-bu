import { ProductSelection } from "./product-selection";
import { GoalSelection } from "./goal-selection";
import { PhotoBookDetails } from "./photo-book-details";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useFieldsEmptyCheck } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Start() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const hasEmptyFields = useFieldsEmptyCheck(startPage);
  console.log("hasEmptyFields startPage", hasEmptyFields);

  return (
    <TabsContent value="Start">
      <ProductSelection />
      <GoalSelection />
      <PhotoBookDetails />
      <Button
        disabled={hasEmptyFields}
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
      >
        Add Design Info
      </Button>
    </TabsContent>
  );
}
