import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import BookMetadataForm from "./book-metadata-form";
import ContributorsCopyrightForm from "./contributors-copyright-form";
import ISBNSelection from "./isbn-selection";

export default function CopyRight() {
  return (
    <>
      <BookMetadataForm />
      <ContributorsCopyrightForm />
      <ISBNSelection />
    </>
  );
}
