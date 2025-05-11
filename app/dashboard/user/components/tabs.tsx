"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSelection } from "./product-selection";
import { GoalSelection } from "./goal-selection";
import { PhotoBookDetails } from "./photo-book-details";
import { InteriorFileUpload } from "./interior-file-upload";
import { BookSpecifications } from "./book-specifications";
import { PhotoBookCoverDesign } from "./photo-book-cover-design";
import { PhotoBookPreview } from "./photo-book-preview";
import { ProjectDetails } from "./project-details";
import { CategoriesAndKeywords } from "./categories-and-keywords";
import AudienceForm from "./audience-form";
import BookMetadataForm from "./book-metadata-form";
import RetailPriceForm from "./retail-price-form";
import PayeeManagement from "./payee-management";
import ContributorsCopyrightForm from "./contributors-copyright-form";
import ISBNSelection from "./isbn-selection";
import PhotoBookReview from "./photo-book-review";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function MainTabs() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const copyWrite = useSelector((state: RootState) => state.copyWrite);
  const bookSpecifications = useSelector(
    (state: RootState) => state.bookSpecifications
  );
  console.log("startPage", startPage);
  console.log("copyWrite", copyWrite);
  console.log("bookSpecifications", bookSpecifications);

  return (
    <Tabs defaultValue="Start" className="w-[100%]">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="Start">Start</TabsTrigger>
        <TabsTrigger value="Copyright">Copyright</TabsTrigger>
        <TabsTrigger value="Design">Design</TabsTrigger>
        <TabsTrigger value="Details">Details</TabsTrigger>
        <TabsTrigger value="Pricing">Pricing & Payee</TabsTrigger>
        <TabsTrigger value="Review">Review</TabsTrigger>
      </TabsList>
      <TabsContent value="Start">
        <ProductSelection />
        <GoalSelection />
        <PhotoBookDetails />
      </TabsContent>
      <TabsContent value="Copyright">
        <BookMetadataForm />
        <ContributorsCopyrightForm />
        <ISBNSelection />
      </TabsContent>
      <TabsContent value="Design">
        <InteriorFileUpload />
        <BookSpecifications />
        <PhotoBookCoverDesign />
        <PhotoBookPreview />
      </TabsContent>
      <TabsContent value="Details">
        <ProjectDetails />
        <CategoriesAndKeywords />
        <AudienceForm />
      </TabsContent>
      <TabsContent value="Pricing">
        <RetailPriceForm />
        <PayeeManagement />
      </TabsContent>
      <TabsContent value="Review">
        <PhotoBookReview />
      </TabsContent>
    </Tabs>
  );
}
