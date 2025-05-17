import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import PhotoBookReview from "./photo-book-review";

export default function Review() {
  return (
    <TabsContent value="Review">
      <PhotoBookReview />
      <Button variant={"main"} size={"main"} className="w-full text-2xl">
        Confirm & Publish
      </Button>
    </TabsContent>
  );
}
