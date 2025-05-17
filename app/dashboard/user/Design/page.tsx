import { TabsContent } from "@/components/ui/tabs";
import { InteriorFileUpload } from "./interior-file-upload";
import { BookSpecifications } from "./book-specifications";
import { PhotoBookCoverDesign } from "./photo-book-cover-design";
import { PhotoBookPreview } from "./photo-book-preview";
import { Button } from "@/components/ui/button";

export default function Design() {
  return (
    <TabsContent value="Design">
      <InteriorFileUpload />
      <BookSpecifications />
      <PhotoBookCoverDesign />
      <PhotoBookPreview />
      <Button variant={"main"} size={"main"} className="w-full text-2xl">
        Review Book
      </Button>
    </TabsContent>
  );
}
