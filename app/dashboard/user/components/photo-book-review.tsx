"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PhotoBookReview() {
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h1 className="text-xl font-bold">Review Your Photo Book</h1>

      <div className="bg-white p-6 rounded-md shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Cover Preview */}
          <div className="flex-shrink-0">
            <div className="border-4 border-blue-900 p-2 w-[180px]">
              <div className="bg-white p-4 flex flex-col items-center">
                <div className="mb-4">
                  <img
                    src="/placeholder.svg?height=40&width=80"
                    alt="Lulu logo"
                    className="h-10"
                  />
                </div>
                <div className="text-center text-[8px] text-gray-500 space-y-1">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                  <p>
                    Sed do eiusmod tempor incididunt ut labore et dolore magna
                  </p>
                  <p>Ut enim ad minim veniam, quis nostrud exercitation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">other</h2>
                <p className="text-sm text-gray-500 mb-4">ID: nv7kjy4</p>
              </div>
              <Button className="bg-blue-500 hover:bg-blue-600">Revise</Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Photo Book Specifications</h3>

              <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm">
                <span className="text-gray-600">Photo Book Size:</span>
                <span>A4 (8.27 x 11.69 in / 210 x 297 mm)</span>

                <span className="text-gray-600">Page Count:</span>
                <span>30 Pages</span>

                <span className="text-gray-600">Interior Color:</span>
                <span className="text-blue-600">Premium Black & White</span>

                <span className="text-gray-600">Paper Type:</span>
                <span className="text-blue-600">80# White — Coated</span>

                <span className="text-gray-600">Binding Type:</span>
                <span className="text-blue-600">Hardcover Case Wrap</span>

                <span className="text-gray-600">Cover Finish:</span>
                <span className="text-blue-600">Glossy</span>
              </div>

              <div className="pt-2">
                <span className="text-gray-600 text-sm">Print Cost:</span>
                <span className="text-blue-600 font-semibold ml-2">
                  11.59 USD
                </span>
              </div>

              <div className="pt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 flex items-center gap-2"
                >
                  <Download size={16} />
                  Print-Ready Files
                </Button>
                <Button
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 flex items-center gap-2"
                >
                  <Download size={16} />
                  Source Files
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
