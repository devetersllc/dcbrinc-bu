"use client";

import { useDispatch, useSelector } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import type { RootState } from "@/lib/store";
import {
  type BookSpecificationsState,
  setBindingType,
  setBookSize,
  setCoverFinish,
  setInteriorColor,
  setPageCount,
  setPaperType,
  setTotalPrice,
} from "@/lib/features/data/designSlice";
import { useMemo } from "react";

interface PricesObj {
  name: string;
  price: number;
}

const prices: PricesObj[] = [
  { name: "glossy", price: 1 },
  { name: "matte", price: 1 },
  { name: "hardcover-linen", price: 3 },
  { name: "paperback", price: 3 },
  { name: "hardcover-case", price: 27.99 },
  { name: "80lb-white-coated", price: 2 },
  { name: "premium-color", price: 10.05 },
  { name: "black-white", price: 3.18 },
];

const BASE_PRICE = 0;

export function BookSpecifications() {
  const dispatch = useDispatch();
  const design = useSelector((state: RootState) => state.design);
  const startPage = useSelector((state: RootState) => state.startPage);
  const disptach = useDispatch();

  const calculateTotalPrice = () => {
    let total = BASE_PRICE;

    // Add price for interior color
    if (design.interiorColor) {
      const interiorPrice =
        prices.find((p) => p.name === design.interiorColor)?.price || 0;
      total += interiorPrice;
    }

    // Add price for paper type
    if (design.paperType) {
      const paperPrice =
        prices.find((p) => p.name === design.paperType)?.price || 0;
      total += paperPrice;
    }

    // Add price for binding type
    if (design.bindingType) {
      const bindingPrice =
        prices.find((p) => p.name === design.bindingType)?.price || 0;
      total += bindingPrice;
    }

    // Add price for cover finish
    if (design.coverFinish) {
      const finishPrice =
        prices.find((p) => p.name === design.coverFinish)?.price || 0;
      total += finishPrice;
    }

    disptach(setTotalPrice(total));
  };
  useMemo(() => {
    calculateTotalPrice();
  }, [
    design.bindingType,
    design.coverFinish,
    design.interiorColor,
    design.paperType,
  ]);
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold">Specifications</h1>
        </div>
        <div className="md:w-2/3">
          <p className="text-sm">
            Select specifications for your Book, including binding type and
            finish for your cover. Note that if an option is unavailable for
            your Book size, it will not be available in this step.
          </p>
          <div className="flex items-center gap-2 mt-2 bg-blue-50 p-2 rounded text-sm">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <p>
              The icon indicates that the option is available for Global
              Distribution
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Book Size and Page Count */}
      <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-3">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              1
            </span>
            <h3 className="font-semibold">Book Size and Page Count</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">
              The Book Size and Page Count are based on the interior file you
              upload. To change these values, upload a revised PDF file of the
              book.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <div className="col-span-3">
            <Select
              value={design.bookSize}
              onValueChange={(value: BookSpecificationsState["bookSize"]) =>
                dispatch(setBookSize(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select book size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">
                  A4 (8.27 x 11.69 in / 210 x 297 mm)
                </SelectItem>
                <SelectItem value="a5">
                  A5 (5.83 x 8.27 in / 148 x 210 mm)
                </SelectItem>
                <SelectItem value="square">
                  Square (8 x 8 in / 203 x 203 mm)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Select
              value={design.pageCount}
              onValueChange={(value: BookSpecificationsState["pageCount"]) =>
                dispatch(setPageCount(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Page count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="36">36</SelectItem>
                <SelectItem value="42">42</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="54">54</SelectItem>
                <SelectItem value="60">60</SelectItem>
                <SelectItem value="66">66</SelectItem>
                <SelectItem value="72">72</SelectItem>
                <SelectItem value="78">78</SelectItem>
                <SelectItem value="84">84</SelectItem>
                <SelectItem value="90">90</SelectItem>
                <SelectItem value="96">96</SelectItem>
                <SelectItem value="100+">100+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {startPage.goal !== "publish" && (
        <>
          {/* Step 2: Interior Color */}
          <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="md:w-1/3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  2
                </span>
                <h3 className="font-semibold">Interior Color</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-sm">
                  Books use only Premium inks to provide the best coverage on
                  the page.
                </p>
              </div>
            </div>
            <RadioGroup
              disabled={!design.processedPDF}
              value={design.interiorColor}
              onValueChange={(
                value: BookSpecificationsState["interiorColor"]
              ) => dispatch(setInteriorColor(value))}
              className={`grid grid-cols-1 md:grid-cols-6 gap-4 w-full ${
                !design.processedPDF && "cursor-not-allowed opacity-60"
              }`}
            >
              <Label
                htmlFor="premium-color"
                className={`border rounded-md p-2 col-span-2 ${
                  design.interiorColor === "premium-color"
                    ? "ring-2 ring-blue-500"
                    : ""
                } ${
                  !design.processedPDF ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center mb-2">
                  <RadioGroupItem value="premium-color" id="premium-color" />
                  <div className="ml-2 font-medium">Premium Color</div>
                </div>
                <div className="h-36 flex items-center justify-center p-1">
                  <Image
                    src="/design.webp"
                    alt="Premium color book interior example"
                    className="object-cover h-full w-full"
                    width={100}
                    height={100}
                  />
                </div>
              </Label>
              <Label
                htmlFor="black-white"
                className={`border rounded-md p-2 col-span-2 ${
                  design.interiorColor === "black-white"
                    ? "ring-2 ring-blue-500"
                    : ""
                }  ${
                  !design.processedPDF ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center mb-2">
                  <RadioGroupItem value="black-white" id="black-white" />
                  <div className="ml-2 font-medium">Black & White</div>
                </div>
                <div className="h-36 flex items-center justify-center p-1">
                  <Image
                    src="/design 2.webp"
                    alt="Black and white book interior example"
                    className="object-cover h-full w-full"
                    width={100}
                    height={100}
                  />
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Step 3: Paper Type */}
          <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="md:w-1/3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  3
                </span>
                <h3 className="font-semibold">Paper Type</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-sm">
                  Books use our highest quality 80# paper for color and black &
                  white printing.
                </p>
              </div>
            </div>
            <RadioGroup
              disabled={!design.interiorColor}
              value={design.paperType}
              onValueChange={(value: BookSpecificationsState["paperType"]) =>
                dispatch(setPaperType(value))
              }
              className={`grid grid-cols-1 md:grid-cols-6 gap-4 w-full ${
                !design.interiorColor && "cursor-not-allowed opacity-60"
              }`}
            >
              <Label
                htmlFor="80lb-white-coated"
                className={`border rounded-md p-2 col-span-2 ${
                  design.paperType === "80lb-white-coated"
                    ? "ring-2 ring-blue-500"
                    : ""
                } ${
                  !design.interiorColor
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <div className="flex items-center mb-2">
                  <RadioGroupItem
                    value="80lb-white-coated"
                    id="80lb-white-coated"
                  />
                  <div className="ml-2 font-medium">80# White - Coated</div>
                </div>
                <div className="h-36 flex items-center justify-center p-1">
                  <Image
                    src="/design 3.webp"
                    alt="80# white coated paper example"
                    className="object-cover h-full w-full"
                    width={100}
                    height={100}
                  />
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Step 4: Binding Type */}
          <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="md:w-1/3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  4
                </span>
                <h3 className="font-semibold">Binding Type</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-sm">Pick a binding option for your Book.</p>
              </div>
            </div>
            <RadioGroup
              disabled={!design.paperType}
              value={design.bindingType}
              onValueChange={(value: BookSpecificationsState["bindingType"]) =>
                dispatch(setBindingType(value))
              }
              className={`grid grid-cols-1 md:grid-cols-6 gap-4 w-full ${
                !design.paperType && "cursor-not-allowed opacity-60"
              }`}
            >
              <Label
                htmlFor="hardcover-linen"
                className={`border rounded-md p-2 col-span-2 ${
                  design.bindingType === "hardcover-linen"
                    ? "ring-2 ring-blue-500"
                    : ""
                } ${
                  !design.paperType ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center mb-2">
                  <RadioGroupItem
                    value="hardcover-linen"
                    id="hardcover-linen"
                  />
                  <div className="ml-2 font-medium">Hardcover Linen</div>
                </div>
                <div className="h-36 flex items-center justify-center p-1">
                  <Image
                    src="/design 4.webp"
                    alt="Hardcover linen binding example"
                    className="object-cover h-full w-full"
                    width={100}
                    height={100}
                  />
                </div>
              </Label>
              <Label
                htmlFor="paperback"
                className={`border rounded-md p-2 col-span-2 ${
                  design.bindingType === "paperback"
                    ? "ring-2 ring-blue-500"
                    : ""
                } ${
                  !design.paperType ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center mb-2">
                  <RadioGroupItem value="paperback" id="paperback" />
                  <div className="ml-2 font-medium">Paperback</div>
                </div>
                <div className="h-36 flex items-center justify-center p-1">
                  <Image
                    src="/design 5.webp"
                    alt="Paperback binding example"
                    className="object-cover h-full w-full"
                    width={100}
                    height={100}
                  />
                </div>
              </Label>
            </RadioGroup>
          </div>

          {/* Step 5: Cover Finish */}
          <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
            <div className="flex flex-col md:flex-row gap-4 items-center w-full">
              <div className="md:w-1/3 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                  5
                </span>
                <h3 className="font-semibold">Cover Finish</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-sm">
                  Select the cover finish for your Book.
                </p>
              </div>
            </div>
            <RadioGroup
              disabled={!design.bindingType}
              value={design.coverFinish}
              onValueChange={(value: BookSpecificationsState["coverFinish"]) =>
                dispatch(setCoverFinish(value))
              }
              className={`grid grid-cols-1 md:grid-cols-6 gap-4 w-full ${
                !design.bindingType && "cursor-not-allowed opacity-60"
              }`}
            >
              <Label
                htmlFor="glossy"
                className={`border rounded-md p-2 col-span-2 ${
                  design.coverFinish === "glossy" ? "ring-2 ring-blue-500" : ""
                } ${
                  !design.bindingType ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center">
                  <RadioGroupItem value="glossy" id="glossy" />
                  <div className="ml-2 font-medium">Glossy</div>
                </div>
              </Label>
              <Label
                htmlFor="matte"
                className={`border rounded-md p-2 col-span-2 ${
                  design.coverFinish === "matte" ? "ring-2 ring-blue-500" : ""
                } ${
                  !design.bindingType ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center">
                  <RadioGroupItem value="matte" id="matte" />
                  <div className="ml-2 font-medium">Matte</div>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">Book Cost</div>
              <div className="bg-green-500 text-white px-4 py-1 rounded-md font-bold">
                ${design.totalPrice.toFixed(2)} USD
              </div>
            </div>
            {design.totalPrice > BASE_PRICE && (
              <div className="mt-2 text-sm text-gray-600">
                {design.interiorColor && (
                  <div className="flex justify-between">
                    <span>Interior Color ({design.interiorColor}):</span>
                    <span>
                      +$
                      {(
                        prices.find((p) => p.name === design.interiorColor)
                          ?.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {design.paperType && (
                  <div className="flex justify-between">
                    <span>Paper Type ({design.paperType}):</span>
                    <span>
                      +$
                      {(
                        prices.find((p) => p.name === design.paperType)
                          ?.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {design.bindingType && (
                  <div className="flex justify-between">
                    <span>Binding Type ({design.bindingType}):</span>
                    <span>
                      +$
                      {(
                        prices.find((p) => p.name === design.bindingType)
                          ?.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                {design.coverFinish && (
                  <div className="flex justify-between">
                    <span>Cover Finish ({design.coverFinish}):</span>
                    <span>
                      +$
                      {(
                        prices.find((p) => p.name === design.coverFinish)
                          ?.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
