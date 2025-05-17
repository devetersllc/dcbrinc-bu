import { TabsContent } from "@/components/ui/tabs";
import { InteriorFileUpload } from "./interior-file-upload";
import { BookSpecifications } from "./book-specifications";
import { PhotoBookCoverDesign } from "./photo-book-cover-design";
import { PhotoBookPreview } from "./photo-book-preview";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useFieldsEmptyCheck } from "@/lib/hooks";

export default function Design() {
  const design = useSelector((state: RootState) => state.design);
  const hasEmptyFields = useFieldsEmptyCheck(design);
  console.log("hasEmptyFields design", hasEmptyFields);

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
