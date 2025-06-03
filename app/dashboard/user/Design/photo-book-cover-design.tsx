"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Upload,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
  setProcessedCover,
  setProcessingCover,
} from "@/lib/features/data/designSlice";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export function PhotoBookCoverDesign() {
  const [coverOption, setCoverOption] = useState("upload");
  const [uploadExpanded, setUploadExpanded] = useState(true);
  const [createExpanded, setCreateExpanded] = useState(false);
  const dispatch = useDispatch();
  const { processedCover, processingCover } = useSelector(
    (state: RootState) => state.design
  );
  console.log("processedCover---", processedCover);

  const toggleUploadSection = () => {
    setUploadExpanded(!uploadExpanded);
  };

  const toggleCreateSection = () => {
    setCreateExpanded(!createExpanded);
  };

  const handleOptionChange = (value: string) => {
    setCoverOption(value);
    if (value === "upload") {
      setUploadExpanded(true);
      setCreateExpanded(false);
    } else {
      setUploadExpanded(false);
      setCreateExpanded(true);
    }
  };

  const processCover = async (file: File | null) => {
    if (!file) return;
    dispatch(setProcessingCover(true));

    try {
      const formData = new FormData();
      formData.append("cover", file);

      const response = await fetch("/api/process-cover", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const result = await response.json();
      dispatch(setProcessedCover(result));
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    } finally {
      dispatch(setProcessingCover(false));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.files", event.target.files);
    
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processCover(selectedFile);
      dispatch(setProcessedCover(null));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      processCover(droppedFile);
      setProcessedCover(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <h1 className="text-xl font-bold mb-6">Photo Book Cover Design</h1>

      <RadioGroup
        value={coverOption}
        onValueChange={handleOptionChange}
        className="space-y-4"
      >
        <div className="border rounded-lg overflow-hidden">
          <div
            className={`border-l-4 ${
              coverOption === "upload"
                ? "border-l-green-500"
                : "border-l-transparent"
            }`}
          >
            <div className="flex items-start p-4">
              <RadioGroupItem value="upload" id="upload" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label
                  htmlFor="upload"
                  className="font-bold text-base cursor-pointer"
                >
                  Upload Your Cover
                </Label>
                <p className="text-sm text-gray-600">
                  Upload a cover for your Photo Book.
                </p>
              </div>
              <button
                onClick={toggleUploadSection}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ChevronUp
                  className={`h-5 w-5 transition-transform ${
                    uploadExpanded ? "" : "rotate-180"
                  }`}
                />
              </button>
            </div>

            {uploadExpanded && (
              <div className="border-t px-6 py-4">
                <Button
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 mb-6"
                >
                  Download Template
                </Button>

                <div className="mb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <h3 className="font-semibold">Uploaded File</h3>
                    </div>
                    <div className="md:w-2/3">
                      <p className="text-base">
                        {processedCover?.coverFileName}
                      </p>
                      {processedCover?.properties && (
                        <p className="text-sm text-gray-600">
                          {processedCover?.properties?.pageCount} Pages
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {processedCover && (
                  <>
                    {processedCover.properties.errors.length > 0 &&
                      processedCover.properties.errors.map((item, index) => (
                        <Alert
                          className="mb-6 border-red-300 bg-red-50 text-red-900"
                          key={index}
                        >
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <AlertDescription>{item}</AlertDescription>
                        </Alert>
                      ))}
                    {processedCover.uploadSuccess && (
                      <Alert className="mb-6 border-green-300 bg-green-50 text-green-900">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <AlertDescription>
                          Your Photo Book file was successfully uploaded! Please
                          continue designing your Photo Book below.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                )}

                <div
                  className="border-2 border-dashed border-blue-200 rounded-lg p-6 mb-8 bg-blue-50 flex flex-col items-center justify-center text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-10 w-10 text-blue-900 mb-2" />
                  <label
                    htmlFor="coverUpload"
                    className="text-lg font-medium text-gray-900 mb-2"
                  >
                    Drop your PDF here, or click to browse
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF files only, max 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="coverUpload"
                  />
                  <label htmlFor="coverUpload">
                    <span className="flex justify-center items-center px-4 py-2 border rounded-lg bg-white ">
                      {processingCover ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Choose a PDF file"
                      )}
                    </span>
                  </label>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Cover Requirements:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>File Type: PDF</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Page Count: 1</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Dimensions: 16.79 x 11.94 inches</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Spine Width: 0 inches</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Fonts: Embedded</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Layers: Flattened</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div
            className={`border-l-4 ${
              coverOption === "create"
                ? "border-l-green-500"
                : "border-l-transparent"
            }`}
          >
            <div className="flex items-start p-4 bg-gray-50">
              <RadioGroupItem value="create" id="create" className="mt-1" />
              <div className="ml-3 flex-1">
                <Label
                  htmlFor="create"
                  className="font-bold text-base cursor-pointer"
                >
                  Create Your Cover
                </Label>
                <p className="text-sm text-gray-600">
                  Use our cover design tool to create a cover for your Photo
                  Book.
                </p>
              </div>
              <button
                onClick={toggleCreateSection}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    createExpanded ? "rotate-180" : ""
                  }`}
                />
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
  );
}
