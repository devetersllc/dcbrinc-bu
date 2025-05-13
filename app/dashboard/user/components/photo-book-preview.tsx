"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export function PhotoBookPreview() {
  const [viewOptions, setViewOptions] = useState({
    margin: true,
    wrap: true,
    folds: true,
    trim: true,
  })
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 1

  const handleViewOptionChange = (option: keyof typeof viewOptions) => {
    setViewOptions({
      ...viewOptions,
      [option]: !viewOptions[option],
    })
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold">Photo Book Preview</h1>
        </div>
        <div className="md:w-2/3">
          <p className="text-sm">
            Use this preview window to see how your Photo Book will look. Carefully review the margins, bleed, and fold
            areas to ensure your Photo Book will print correctly.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="margin"
            checked={viewOptions.margin}
            onCheckedChange={() => handleViewOptionChange("margin")}
            className="bg-blue-900 data-[state=checked]:bg-blue-900"
          />
          <Label htmlFor="margin">Margin</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="wrap"
            checked={viewOptions.wrap}
            onCheckedChange={() => handleViewOptionChange("wrap")}
            className="bg-blue-500 data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="wrap">Wrap</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="folds"
            checked={viewOptions.folds}
            onCheckedChange={() => handleViewOptionChange("folds")}
            className="bg-purple-500 data-[state=checked]:bg-purple-500"
          />
          <Label htmlFor="folds">Folds</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="trim"
            checked={viewOptions.trim}
            onCheckedChange={() => handleViewOptionChange("trim")}
            className="bg-gray-900 data-[state=checked]:bg-gray-900"
          />
          <Label htmlFor="trim">Trim</Label>
        </div>
      </div>

      <div className="relative bg-blue-100 border-4 border-blue-500 mb-4 p-2">
        <div className="flex">
          <div className="w-1/2 border-r-4 border-r-pink-500 p-2 bg-white">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-blue-900 font-bold text-3xl mb-2 flex items-center">
                <div className="transform -rotate-12 mr-1">
                  <div className="w-6 h-8 bg-blue-900 rounded-sm"></div>
                </div>
                lulu
              </div>
              <div className="text-center font-bold mb-4">BACK COVER</div>

              {viewOptions.margin && (
                <>
                  <div className="w-full border border-yellow-500 p-1 mb-2">
                    <div className="text-xs">SAFETY MARGIN (from wrap edge)</div>
                    <div className="text-xs">0.125" / 3.175mm</div>
                  </div>

                  <div className="w-full border border-green-500 p-1 mb-2">
                    <div className="text-xs">WRAP AREA (from wrap edge)</div>
                    <div className="text-xs">0.75" / 19.05mm</div>
                  </div>

                  <div className="w-full border border-orange-500 p-1 mb-2">
                    <div className="text-xs">BARCODE AREA (required)</div>
                    <div className="text-xs">2.625" x 1.00" (66.675 x 25.4mm)</div>
                    <div className="text-xs">0.625" from bottom/right wrap edge</div>
                  </div>
                </>
              )}

              <div className="mt-auto w-full">
                <div className="bg-yellow-300 p-2 text-center">BARCODE AREA</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 p-2 bg-white">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-blue-900 font-bold text-3xl mb-2 flex items-center">
                <div className="transform -rotate-12 mr-1">
                  <div className="w-6 h-8 bg-blue-900 rounded-sm"></div>
                </div>
                lulu
              </div>
              <div className="text-center font-bold mb-4">FRONT COVER</div>

              {viewOptions.margin && (
                <>
                  <div className="w-full border border-gray-500 p-1 mb-2">
                    <div className="text-xs">TOTAL DOCUMENT SIZE (with wrap)</div>
                    <div className="text-xs">18.54" x 13.44" (470.92mm x 341.38mm)</div>
                  </div>

                  <div className="w-full border border-purple-500 p-1 mb-2">
                    <div className="text-xs">SPINE AREA</div>
                    <div className="text-xs">0.25" x 11.00" (6.35mm x 279.4mm)</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="w-4 h-4 bg-blue-900 rounded-full mr-2"></div>
        <Slider
          value={[currentPage]}
          max={totalPages}
          step={1}
          className="flex-1"
          onValueChange={(value) => setCurrentPage(value[0])}
        />
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <Button variant="outline" size="sm">
          <ChevronFirst className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          Cover
        </Button>
        <Button variant="outline" size="sm">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          <ChevronLast className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Important Information About Your Photo Book</h3>
        <p className="text-sm mb-2">
          Download and check your print-ready files before continuing. The following may impact your printing:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>
            <span className="font-semibold">Bleed</span> - All Photo Book files must be sized for Full Bleed. If your
            file is sized to the exact dimensions for your Photo Book, Lulu must add a white margin around the outer
            edges of your pages to compensate. If your Photo Book includes color or content that stretches to the edge
            of your page, be sure to review our{" "}
            <Link href="#" className="text-blue-900 font-medium">
              Full Bleed instructions
            </Link>
            .
          </li>
          <li>
            <span className="font-semibold">Spine</span> - Trimming tolerance for your spine is 0.125" / 3.18 mm toward
            the front and back cover. Designing your spine with sufficient margins also variance in mind will help avoid
            issues with spine text alignment and any cut-off text around the edges of your content.{" "}
            <Link href="#" className="text-blue-900 font-medium">
              Learn more about spine and trim variance
            </Link>
            .
          </li>
          <li>
            <span className="font-semibold">Color</span> - Color may differ slightly between your digital file and your
            printed Photo Book. To learn more about color variance, see our{" "}
            <Link href="#" className="text-blue-900 font-medium">
              PDF Creation instructions
            </Link>
            .
          </li>
        </ol>
      </div>

      <Button className="bg-blue-500 hover:bg-blue-600 w-full md:w-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Print-Ready Files
      </Button>
    </div>
  )
}
