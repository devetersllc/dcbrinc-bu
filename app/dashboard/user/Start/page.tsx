import { ProductSelection } from "./product-selection";
import { GoalSelection } from "./goal-selection";
import { PhotoBookDetails } from "./photo-book-details";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

export default function Start() {
  return (
    <TabsContent value="Start">
      <ProductSelection />
      <GoalSelection />
      <PhotoBookDetails />
      <Button variant={"main"} size={"main"} className="w-full text-2xl">
        Add Design Info
      </Button>
    </TabsContent>
  );
}
