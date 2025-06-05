"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { dataAccordingToType } from "@/lib/constants";
import { useDispatch } from "react-redux";
import {
  setProcessedPDF,
  setProcessing,
} from "@/lib/features/data/designSlice";

export function InteriorFileUpload() {
  const { type } = useSelector((state: RootState) => state.startPage);
  const { processedPDF, processing } = useSelector(
    (state: RootState) => state.design
  );
  const dispatch = useDispatch();

  const processPDF = async (file: File | null) => {
    if (!file) return;
    dispatch(setProcessing(true));

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("bookType", type); // Pass book type to API

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process PDF");
      }

      const result = await response.json();
      dispatch(setProcessedPDF(result));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      // Set error in processed PDF state
      dispatch(
        setProcessedPDF({
          properties: {
            valid: false,
            errors: [errorMessage],
            pageCount: null,
            fileType: null,
            fontsEmbedded: null,
            layersFlattened: null,
            dimensions: null,
          },
          fileName: file.name,
          uploadSuccess: false,
          pdfDataUrl: "",
          cloudinaryUrl: "",
          publicId: "",
          fileSize: undefined,
        })
      );
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      dispatch(setProcessedPDF(null)); // Clear previous results
      processPDF(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      // Check file type based on book type
      const allowedExtensions = getAllowedExtensions(type);
      const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        dispatch(setProcessedPDF(null)); // Clear previous results
        processPDF(droppedFile);
      } else {
        dispatch(
          setProcessedPDF({
            properties: {
              valid: false,
              errors: [
                `File type not supported. Allowed types: ${dataAccordingToType[type].fileType}`,
              ],
              pageCount: null,
              fileType: null,
              fontsEmbedded: null,
              layersFlattened: null,
              dimensions: null,
            },
            fileName: droppedFile.name,
            uploadSuccess: false,
            pdfDataUrl: "",
            cloudinaryUrl: "",
            publicId: "",
            fileSize: undefined,
          })
        );
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearFile = () => {
    dispatch(setProcessedPDF(null));
  };

  const getAcceptedFileTypes = (bookType: string) => {
    if (bookType === "ebook") {
      return ".pdf,.epub,.docx,.rtf,.odt";
    }
    return ".pdf";
  };

  const getAllowedExtensions = (bookType: string) => {
    if (bookType === "ebook") {
      return ["pdf", "epub", "docx", "rtf", "odt"];
    }
    return ["pdf"];
  };

  const getFileTypeDisplay = () => {
    return dataAccordingToType[type]?.fileType || "PDF";
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold">Interior File Upload</h1>
        </div>
        <div className="md:w-2/3">
          <p className="text-base">
            Your Interior File must be a {getFileTypeDisplay()} including all
            interior content for your {type.replace("-", " ")}. For detailed
            file creation instructions, see our{" "}
            <Link href="#" className="text-blue-900 font-medium">
              File Creation Guide
            </Link>
            .
          </p>
        </div>
      </div>

      {processedPDF && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <h3 className="font-semibold">Uploaded File</h3>
            </div>
            <div className="md:w-2/3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base">{processedPDF?.fileName}</p>
                  {processedPDF?.properties?.pageCount && (
                    <p className="text-sm text-gray-600">
                      {processedPDF.properties.pageCount} Pages
                    </p>
                  )}
                  {processedPDF?.fileSize && (
                    <p className="text-sm text-gray-600">
                      {(processedPDF.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {processedPDF && (
        <>
          {processedPDF.properties?.errors?.length > 0 &&
            processedPDF.properties.errors.map((error, index) => (
              <Alert
                className="mb-6 border-red-300 bg-red-50 text-red-900"
                key={index}
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          {processedPDF.uploadSuccess && processedPDF.properties?.valid && (
            <Alert className="mb-6 border-green-300 bg-green-50 text-green-900">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription>
                Your {type.replace("-", " ")} file was successfully uploaded and
                validated! Please continue designing your{" "}
                {type.replace("-", " ")} below.
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
          htmlFor="fileUpload"
          className="text-lg font-medium text-gray-900 mb-2 cursor-pointer"
        >
          Drop your {getFileTypeDisplay()} here, or click to browse
        </label>
        <p className="text-sm text-gray-500 mb-4">
          {getFileTypeDisplay()} files only, max 50MB
        </p>
        <input
          type="file"
          accept={getAcceptedFileTypes(type)}
          onChange={handleFileSelect}
          className="hidden"
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="cursor-pointer">
          <span className="flex justify-center items-center px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Choose a ${getFileTypeDisplay()} file`
            )}
          </span>
        </label>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">
          Requirements for {type.replace("-", " ")}:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
            <span>File Type: {dataAccordingToType[type]?.fileType}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
            <span>Page Count: {dataAccordingToType[type]?.pageCount}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
            <span>Fonts: {dataAccordingToType[type]?.fonts}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
            <span>Layers: {dataAccordingToType[type]?.layers}</span>
          </div>
          {dataAccordingToType[type]?.pageSize && (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
              <span>Page Size: {dataAccordingToType[type].pageSize}</span>
            </div>
          )}
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
            <span>Max File Size: 50MB</span>
          </div>
        </div>
      </div>

      {processedPDF?.properties && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">
            Validation Summary:
          </h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              {processedPDF.properties.fontsEmbedded ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <X className="h-4 w-4 text-red-600 mr-2" />
              )}
              <span>
                Fonts Embedded:{" "}
                {processedPDF.properties.fontsEmbedded ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center">
              {processedPDF.properties.layersFlattened ? (
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              ) : (
                <X className="h-4 w-4 text-red-600 mr-2" />
              )}
              <span>
                Layers Flattened:{" "}
                {processedPDF.properties.layersFlattened ? "Yes" : "No"}
              </span>
            </div>
            {processedPDF.properties.pageCount && (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                <span>Page Count: {processedPDF.properties.pageCount}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
