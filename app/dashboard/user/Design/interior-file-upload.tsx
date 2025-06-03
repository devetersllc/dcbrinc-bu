"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/lib/store";
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
  console.log("processedPDF---", processedPDF);
  const processPDF = async (file: File | null) => {
    if (!file) return;
    dispatch(setProcessing(true));

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const result = await response.json();
      dispatch(setProcessedPDF(result));
    } catch (err) {
      console.log(err instanceof Error ? err.message : "An error occurred");
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("trigeered---");

    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      processPDF(selectedFile);
      dispatch(setProcessedPDF(null));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      processPDF(droppedFile);
      setProcessedPDF(null);
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <h1 className="text-xl font-bold">Interior File Upload</h1>
        </div>
        <div className="md:w-2/3">
          <p className="text-base">
            Your Interior File must be a PDF including all interior content for
            your Photo Book. For detailed PDF creation instructions, see our{" "}
            <Link href="#" className="text-blue-900 font-medium">
              PDF Creation Guide
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="font-semibold">Uploaded File</h3>
          </div>
          <div className="md:w-2/3">
            {/* <p className="text-base">{file.name}</p>
            <p className="text-sm text-gray-600">{file.pages} Pages</p> */}
          </div>
        </div>
      </div>

      {processedPDF && (
        <>
          {processedPDF.properties.errors.length > 0 &&
            processedPDF.properties.errors.map((item, index) => (
              <Alert
                className="mb-6 border-red-300 bg-red-50 text-red-900"
                key={index}
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <AlertDescription>{item}</AlertDescription>
              </Alert>
            ))}
          {processedPDF.uploadSuccess && (
            <Alert className="mb-6 border-green-300 bg-green-50 text-green-900">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription>
                Your Photo Book file was successfully uploaded! Please continue
                designing your Photo Book below.
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
          htmlFor="pdfUpload"
          className="text-lg font-medium text-gray-900 mb-2"
        >
          Drop your PDF here, or click to browse
        </label>
        <p className="text-sm text-gray-500 mb-4">PDF files only, max 50MB</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdfUpload"
        />
        <label htmlFor="pdfUpload">
          <span className="flex justify-center items-center px-4 py-2 border rounded-lg bg-white ">
            {processing ? (
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

      <div>
        <h3 className="text-sm font-semibold uppercase mb-3">Requirements:</h3>
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="w-28 font-medium">File Type:</span>
            <span>{dataAccordingToType[type].fileType}</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Page Count:</span>
            <span>{dataAccordingToType[type].pageCount}</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Fonts:</span>
            <span>{dataAccordingToType[type].fonts}</span>
          </div>
          <div className="flex">
            <span className="w-28 font-medium">Layers:</span>
            <span>{dataAccordingToType[type].layers}</span>
          </div>
          {dataAccordingToType[type].pageSize && (
            <div className="flex">
              <span className="w-28 font-medium">Page Count:</span>
              <span>{dataAccordingToType[type].pageSize}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
