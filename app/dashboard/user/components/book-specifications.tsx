"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon } from "lucide-react"
import Image from "next/image"

export function BookSpecifications() {
  const [bookSize, setBookSize] = useState("a4")
  const [pageCount, setPageCount] = useState("30")
  const [interiorColor, setInteriorColor] = useState("black-white")
  const [paperType, setPaperType] = useState("80lb-white-coated")
  const [bindingType, setBindingType] = useState("hardcover-case")
  const [coverFinish, setCoverFinish] = useState("glossy")

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold">Book Specifications</h2>
        </div>
        <div className="md:w-2/3">
          <p className="text-sm">
            Select specifications for your Photo Book, including binding type and finish for your cover. Note that if an
            option is unavailable for your Photo Book size, it will not be available in this step.
          </p>
          <div className="flex items-center gap-2 mt-2 bg-blue-50 p-2 rounded text-sm">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <p>The icon indicates that the option is available for Global Distribution</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              1
            </span>
            <h3 className="font-semibold">Book Size and Page Count</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">
              The Book Size and Page Count are based on the interior file you upload. To change these values, upload a
              revised PDF file of the book.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Select value={bookSize} onValueChange={setBookSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select book size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4 (8.27 x 11.69 in / 210 x 297 mm)</SelectItem>
                    <SelectItem value="a5">A5 (5.83 x 8.27 in / 148 x 210 mm)</SelectItem>
                    <SelectItem value="square">Square (8 x 8 in / 203 x 203 mm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={pageCount} onValueChange={setPageCount}>
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
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              2
            </span>
            <h3 className="font-semibold">Interior Color</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">Photo Books use only Premium inks to provide the best coverage on the page.</p>
            <RadioGroup
              value={interiorColor}
              onValueChange={setInteriorColor}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className={`border rounded-md p-2 ${interiorColor === "black-white" ? "ring-2 ring-blue-500" : ""}`}>
                <div className="flex items-start mb-2">
                  <RadioGroupItem value="black-white" id="black-white" className="mt-1" />
                  <Label htmlFor="black-white" className="ml-2 font-medium">
                    Premium Black & White
                  </Label>
                </div>
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=160"
                    alt="Black and white book example"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                className={`border rounded-md p-2 ${interiorColor === "premium-color" ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start mb-2">
                  <RadioGroupItem value="premium-color" id="premium-color" className="mt-1" />
                  <Label htmlFor="premium-color" className="ml-2 font-medium">
                    Premium Color
                  </Label>
                </div>
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=160"
                    alt="Color book example"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              3
            </span>
            <h3 className="font-semibold">Paper Type</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">
              Photo Books use our highest quality 80# paper for color and black & white printing.
            </p>
            <div className={`border rounded-md p-2 ${paperType === "80lb-white-coated" ? "ring-2 ring-blue-500" : ""}`}>
              <RadioGroup value={paperType} onValueChange={setPaperType}>
                <div className="flex items-start">
                  <RadioGroupItem value="80lb-white-coated" id="80lb-white-coated" className="mt-1" />
                  <Label htmlFor="80lb-white-coated" className="ml-2 font-medium">
                    80# White - Coated
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              4
            </span>
            <h3 className="font-semibold">Binding Type</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">Pick a binding option for your Photo Book.</p>
            <RadioGroup
              value={bindingType}
              onValueChange={setBindingType}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div
                className={`border rounded-md p-2 ${bindingType === "hardcover-case" ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start mb-2">
                  <RadioGroupItem value="hardcover-case" id="hardcover-case" className="mt-1" />
                  <Label htmlFor="hardcover-case" className="ml-2 font-medium">
                    Hardcover Case Wrap
                  </Label>
                </div>
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Hardcover case wrap"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={`border rounded-md p-2 ${bindingType === "paperback" ? "ring-2 ring-blue-500" : ""}`}>
                <div className="flex items-start mb-2">
                  <RadioGroupItem value="paperback" id="paperback" className="mt-1" />
                  <Label htmlFor="paperback" className="ml-2 font-medium">
                    Paperback Perfect Bound
                  </Label>
                </div>
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Paperback perfect bound"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                className={`border rounded-md p-2 ${bindingType === "hardcover-linen" ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="flex items-start mb-2">
                  <RadioGroupItem value="hardcover-linen" id="hardcover-linen" className="mt-1" />
                  <Label htmlFor="hardcover-linen" className="ml-2 font-medium">
                    Hardcover Linen Wrap
                  </Label>
                </div>
                <div className="h-24 bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Hardcover linen wrap"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
              5
            </span>
            <h3 className="font-semibold">Cover Finish</h3>
          </div>
          <div className="md:w-2/3">
            <p className="text-sm mb-3">Select the cover finish for your Photo Book.</p>
            <RadioGroup
              value={coverFinish}
              onValueChange={setCoverFinish}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className={`border rounded-md p-2 ${coverFinish === "glossy" ? "ring-2 ring-blue-500" : ""}`}>
                <div className="flex items-start">
                  <RadioGroupItem value="glossy" id="glossy" className="mt-1" />
                  <Label htmlFor="glossy" className="ml-2 font-medium">
                    Glossy
                  </Label>
                </div>
              </div>
              <div className={`border rounded-md p-2 ${coverFinish === "matte" ? "ring-2 ring-blue-500" : ""}`}>
                <div className="flex items-start">
                  <RadioGroupItem value="matte" id="matte" className="mt-1" />
                  <Label htmlFor="matte" className="ml-2 font-medium">
                    Matte
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-2">
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">Book Cost</div>
          <div className="bg-green-500 text-white px-4 py-1 rounded-md font-bold">$1.99 USD</div>
        </div>
      </div>
    </div>
  )
}
