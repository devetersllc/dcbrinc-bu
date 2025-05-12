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
import { Button } from "@/components/ui/button";

export default function MainTabs() {
  const startPage = useSelector((state: RootState) => state.startPage);
  const copyWrite = useSelector((state: RootState) => state.copyWrite);
  const design = useSelector((state: RootState) => state.design);
  const detail = useSelector((state: RootState) => state.detail);
  const price = useSelector((state: RootState) => state.price);
  console.log("startPage", startPage);
  console.log("copyWrite", copyWrite);
  console.log("design", design);
  console.log("detail", detail);
  console.log("price", price);

  return (
    <Tabs defaultValue="Start" className="w-[100%]">
      <div className="px-2 w-full sticky top-1 z-10">
        <TabsList
          className={`grid border-2 ${
            startPage.goal === "publish" ? "grid-cols-6" : "grid-cols-3"
          }`}
        >
          <TabsTrigger value="Start">Start</TabsTrigger>
          {startPage.goal === "publish" && (
            <>
              <TabsTrigger value="Copyright">Copyright</TabsTrigger>
            </>
          )}
          <TabsTrigger value="Design">Design</TabsTrigger>
          {startPage.goal === "publish" && (
            <>
              <TabsTrigger value="Details">Details</TabsTrigger>
              <TabsTrigger value="Pricing">Pricing & Payee</TabsTrigger>
            </>
          )}
          <TabsTrigger value="Review">Review</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="Start">
        <ProductSelection />
        <GoalSelection />
        <PhotoBookDetails />
        <Button variant={"main"} size={"main"} className="w-full text-2xl">
          Add Design Info
        </Button>
      </TabsContent>
      {startPage.goal === "publish" && (
        <>
          <TabsContent value="Copyright">
            <BookMetadataForm />
            <ContributorsCopyrightForm />
            <ISBNSelection />
          </TabsContent>
        </>
      )}
      <TabsContent value="Design">
        <InteriorFileUpload />
        <BookSpecifications />
        <PhotoBookCoverDesign />
        <PhotoBookPreview />
        <Button variant={"main"} size={"main"} className="w-full text-2xl">
          Review Book
        </Button>
      </TabsContent>
      {startPage.goal === "publish" && (
        <>
          <TabsContent value="Details">
            <ProjectDetails />
            <CategoriesAndKeywords />
            <AudienceForm />
          </TabsContent>
          <TabsContent value="Pricing">
            <RetailPriceForm />
            <PayeeManagement />
          </TabsContent>
        </>
      )}
      <TabsContent value="Review">
        <PhotoBookReview />
        <Button variant={"main"} size={"main"} className="w-full text-2xl">
          Confirm & Publish
        </Button>
      </TabsContent>
    </Tabs>
  );
}
