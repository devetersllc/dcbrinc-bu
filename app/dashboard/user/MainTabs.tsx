"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductSelection } from "./Start/product-selection";
import { GoalSelection } from "./Start/goal-selection";
import { PhotoBookDetails } from "./Start/photo-book-details";
import { InteriorFileUpload } from "./Design/interior-file-upload";
import { BookSpecifications } from "./Design/book-specifications";
import { PhotoBookCoverDesign } from "./Design/photo-book-cover-design";
import { PhotoBookPreview } from "./Design/photo-book-preview";
import { ProjectDetails } from "./Details/project-details";
import { CategoriesAndKeywords } from "./Details/categories-and-keywords";
import AudienceForm from "./Details/audience-form";
import BookMetadataForm from "./CopyRight/book-metadata-form";
import RetailPriceForm from "./Pricing/retail-price-form";
import PayeeManagement from "./Pricing/payee-management";
import ContributorsCopyrightForm from "./CopyRight/contributors-copyright-form";
import ISBNSelection from "./CopyRight/isbn-selection";
import PhotoBookReview from "./Review/photo-book-review";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Start from "./Start/page";
import CopyRight from "./CopyRight/page";
import Design from "./Design/page";
import Details from "./Details/page";
import Pricing from "./Pricing/page";
import Review from "./Review/page";

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
      <div className="px- w-full sticky top-1 z-10">
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
      <div>
        <Start />
        {startPage.goal === "publish" && <CopyRight />}
        <Design />
        {startPage.goal === "publish" && <Details />}
        {startPage.goal === "publish" && <Pricing />}
        <Review />
      </div>
    </Tabs>
  );
}
