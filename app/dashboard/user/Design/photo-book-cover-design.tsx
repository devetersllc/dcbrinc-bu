"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronUp, ChevronDown, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"

export function PhotoBookCoverDesign() {
  const [coverOption, setCoverOption] = useState("upload")
  const [uploadExpanded, setUploadExpanded] = useState(true)
  const [createExpanded, setCreateExpanded] = useState(false)
  const [uploadedFile, setUploadedFile] = useState({
    name: "nv7kjy4-cover-template.pdf",
    uploaded: true,
  })

  const toggleUploadSection = () => {
    setUploadExpanded(!uploadExpanded)
  }

  const toggleCreateSection = () => {
    setCreateExpanded(!createExpanded)
  }

  const handleOptionChange = (value: string) => {
    setCoverOption(value)
    if (value === "upload") {
      setUploadExpanded(true)
      setCreateExpanded(false)
    } else {
      setUploadExpanded(false)
      setCreateExpanded(true)
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h1 className="text-xl font-bold mb-6">Photo Book Cover Design</h1>

      <RadioGroup value={coverOption} onValueChange={handleOptionChange} className="space-y-4">
        <div className="border rounded-lg overflow-hidden">
          <div className={`border-l-4 ${coverOption === "upload" ? "border-l-green-500" : "border-l-transparent"}`}>
            <div className="flex items-start p-4">
              <RadioGroupItem value="upload" id="upload" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label htmlFor="upload" className="font-bold text-base cursor-pointer">
                  Upload Your Cover
                </Label>
                <p className="text-sm text-gray-600">Upload a cover for your Photo Book.</p>
              </div>
              <button onClick={toggleUploadSection} className="p-2 text-gray-500 hover:text-gray-700">
                <ChevronUp className={`h-5 w-5 transition-transform ${uploadExpanded ? "" : "rotate-180"}`} />
              </button>
            </div>

            {uploadExpanded && (
              <div className="border-t px-6 py-4">
                <Button variant="default" className="bg-blue-500 hover:bg-blue-600 mb-6">
                  Download Template
                </Button>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Uploaded File</h3>
                  <p>{uploadedFile.name}</p>
                </div>

                {uploadedFile.uploaded && (
                  <Alert className="mb-6 border-green-300 bg-green-50 text-green-900">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertDescription>
                      You successfully uploaded a cover file! Please preview your Photo Book below.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 mb-6 bg-blue-50 flex flex-col items-center justify-center text-center">
                  <Upload className="h-6 w-6 text-blue-900 mb-2" />
                  <div className="flex items-center gap-1">
                    <Link href="#" className="text-blue-900 font-medium">
                      Replace your PDF file
                    </Link>
                    <span>or Drag & Drop it here</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase mb-3">Requirements:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex">
                      <span className="w-32 font-medium">File Type:</span>
                      <span>PDF</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Page Count:</span>
                      <span>1</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Dimensions:</span>
                      <span>18.54 x 13.44in / 470.92mm x 341.38mm</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Spine Width:</span>
                      <span>0.25in / 6.35mm</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Fonts:</span>
                      <span>Embedded</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium">Layers:</span>
                      <span>Flattened</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className={`border-l-4 ${coverOption === "create" ? "border-l-green-500" : "border-l-transparent"}`}>
            <div className="flex items-start p-4 bg-gray-50">
              <RadioGroupItem value="create" id="create" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label htmlFor="create" className="font-bold text-base cursor-pointer">
                  Create Your Cover
                </Label>
                <p className="text-sm text-gray-600">
                  Use our cover design tool to create a cover for your Photo Book.
                </p>
              </div>
              <button onClick={toggleCreateSection} className="p-2 text-gray-500 hover:text-gray-700">
                <ChevronDown className={`h-5 w-5 transition-transform ${createExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>

            {createExpanded && (
              <div className="border-t px-6 py-4">
                {/* Content for the create cover section would go here */}
                <p>Cover design tool interface would be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
