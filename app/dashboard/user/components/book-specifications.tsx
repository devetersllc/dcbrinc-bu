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
import { RootState } from "@/lib/store";
import {
  BookSpecificationsState,
  setBindingType,
  setBookSize,
  setCoverFinish,
  setInteriorColor,
  setPageCount,
  setPaperType,
} from "@/lib/features/data/designSlice";

export function BookSpecifications() {
  const dispatch = useDispatch();
  const design = useSelector((state: RootState) => state.design);

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold">Book Specifications</h1>
        </div>
        <div className="md:w-2/3">
          <p className="text-sm">
            Select specifications for your Photo Book, including binding type
            and finish for your cover. Note that if an option is unavailable for
            your Photo Book size, it will not be available in this step.
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
              disabled
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
              disabled
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

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
              Photo Books use only Premium inks to provide the best coverage on
              the page.
            </p>
          </div>
        </div>
        <RadioGroup
          value={design.interiorColor}
          onValueChange={(value: BookSpecificationsState["interiorColor"]) =>
            dispatch(setInteriorColor(value))
          }
          className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full"
        >
          <label
            htmlFor="premium-color"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.interiorColor === "premium-color"
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <RadioGroupItem value="premium-color" id="premium-color" />
              <div className="ml-2 font-medium">Premium Color</div>
            </div>
            <div className="h-36 flex items-center justify-center p-1">
              <Image
                src="/placeholder.svg?height=96&width=160"
                alt="Color book example"
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </label>
          <label
            htmlFor="black-white"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.interiorColor === "black-white"
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <RadioGroupItem value="black-white" id="black-white" />
              <div className="ml-2 font-medium">Black & White</div>
            </div>
            <div className="h-36 flex items-center justify-center p-1">
              <Image
                src="/placeholder.svg?height=96&width=160"
                alt="Color book example"
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              2
            </span>
            <h3 className="font-semibold">Paper Type</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm">
              Photo Books use our highest quality 80# paper for color and black
              & white printing.
            </p>
          </div>
        </div>
        <RadioGroup
          value={design.paperType}
          onValueChange={(value: BookSpecificationsState["paperType"]) =>
            dispatch(setPaperType(value))
          }
          className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full"
        >
          <label
            htmlFor="premium-color"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.paperType === "80lb-white-coated"
                ? "ring-2 ring-blue-500"
                : ""
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
                src="/placeholder.svg?height=96&width=160"
                alt="Color book example"
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              2
            </span>
            <h3 className="font-semibold">Binding Type</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm">
              Pick a binding option for your Photo Book.
            </p>
          </div>
        </div>
        <RadioGroup
          value={design.bindingType}
          onValueChange={(value: BookSpecificationsState["bindingType"]) =>
            dispatch(setBindingType(value))
          }
          className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full"
        >
          <label
            htmlFor="hardcover-linen"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.bindingType === "hardcover-linen"
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <RadioGroupItem value="hardcover-linen" id="hardcover-linen" />
              <div className="ml-2 font-medium">Hardcover Linen</div>
            </div>
            <div className="h-36 flex items-center justify-center p-1">
              <Image
                src="/placeholder.svg?height=96&width=160"
                alt="Color book example"
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </label>
          <label
            htmlFor="paperback"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.bindingType === "paperback" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex items-center mb-2">
              <RadioGroupItem value="paperback" id="paperback" />
              <div className="ml-2 font-medium">Paperback</div>
            </div>
            <div className="h-36 flex items-center justify-center p-1">
              <Image
                src="/placeholder.svg?height=96&width=160"
                alt="Color book example"
                className="object-cover h-full w-full"
                width={100}
                height={100}
              />
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="border-t border-gray-200 py-4 flex flex-col justify-start items-start gap-7 w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              2
            </span>
            <h3 className="font-semibold">Cover Finish</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm">
              Select the cover finish for your Photo Book.
            </p>
          </div>
        </div>
        <RadioGroup
          value={design.coverFinish}
          onValueChange={(value: BookSpecificationsState["coverFinish"]) =>
            dispatch(setCoverFinish(value))
          }
          className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full"
        >
          <label
            htmlFor="glossy"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.coverFinish === "glossy" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex items-center">
              <RadioGroupItem value="glossy" id="glossy" />
              <div className="ml-2 font-medium">Glossy</div>
            </div>
          </label>
          <label
            htmlFor="matte"
            className={`border rounded-md p-2 col-span-2 cursor-pointer ${
              design.coverFinish === "matte" ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="flex items-center">
              <RadioGroupItem value="matte" id="matte" />
              <div className="ml-2 font-medium">Matte</div>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">Book Cost</div>
          <div className="bg-green-500 text-white px-4 py-1 rounded-md font-bold">
            $1.99 USD
          </div>
        </div>
      </div>
    </div>
  );
}
