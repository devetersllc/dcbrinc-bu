"use client";
import { InteriorFileUpload } from "./interior-file-upload";
import { BookSpecifications } from "./book-specifications";
import { PhotoBookCoverDesign } from "./photo-book-cover-design";
import { PhotoBookPreview } from "./photo-book-preview";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useFieldsEmptyCheck } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import { setActiveTab } from "@/lib/features/general/general";

export default function Design() {
  const dispatch = useDispatch();
  const general = useSelector((state: RootState) => state.general);
  const design = useSelector((state: RootState) => state.design);
  useFieldsEmptyCheck(design);

  const handleSubmit = () => {
    dispatch(setActiveTab(general.activeTab + 1));
  };

  return (
    <>
      <InteriorFileUpload />
      <BookSpecifications />
      <PhotoBookCoverDesign />
      {design.processedPDF?.pdfDataUrl &&
        design.processedCover?.coverDataUrl && <PhotoBookPreview />}

      <Button
        disabled={
          general.areFieldsEmptyCheck || !design?.processedCover?.cloudinaryUrl
        }
        variant={"main"}
        size={"main"}
        className="w-full text-2xl"
        onClick={handleSubmit}
      >
        Review Book
      </Button>
    </>
  );
}
