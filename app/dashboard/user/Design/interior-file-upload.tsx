"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Upload } from "lucide-react";
import Link from "next/link";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { dataAccordingToType } from "@/lib/constants";

export function InteriorFileUpload() {
  const { type } = useSelector((state: RootState) => state.startPage);
  const [file, setFile] = useState({
    name: "file-example_PDF_1MB.pdf",
    pages: 30,
    uploaded: true,
    warnings: {
      transparency: true,
      lineThickness: true,
      bleed: true,
    },
  });

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
            <p className="text-base">{file.name}</p>
            <p className="text-sm text-gray-600">{file.pages} Pages</p>
          </div>
        </div>
      </div>

      {file.uploaded && (
        <>
          {(file.warnings.transparency ||
            file.warnings.lineThickness ||
            file.warnings.bleed) && (
            <Alert className="mb-4 border-orange-300 bg-orange-50 text-orange-900">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <AlertDescription className="space-y-3">
                {file.warnings.transparency && (
                  <p>
                    <span className="font-semibold">Transparency:</span> We
                    detected an element that may be transparent within your
                    file. We strongly recommend flattening or removing any
                    transparencies in your file.{" "}
                    <Link href="#" className="text-blue-900 font-medium">
                      Review print guidelines
                    </Link>
                    .
                  </p>
                )}
                {file.warnings.lineThickness && (
                  <p>
                    <span className="font-semibold">Images:</span> Your file
                    contains images with line thickness less than 0.14 points.
                    This may be too thin to print. Please review your file.
                  </p>
                )}
                {file.warnings.bleed && (
                  <p>
                    <span className="font-semibold">Full Bleed:</span> Please
                    note that a white Bleed margin has been added to your file.
                    The book preview will show how this Bleed margin impacts
                    your file. If you require image content that extends to the
                    trimmed edge of the page, please upload a PDF prepared for
                    Full Bleed.{" "}
                    <Link href="#" className="text-blue-900 font-medium">
                      Learn about full bleed
                    </Link>
                    .
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Alert className="mb-6 border-green-300 bg-green-50 text-green-900">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertDescription>
              Your Photo Book file was successfully uploaded! Please continue
              designing your Photo Book below.
            </AlertDescription>
          </Alert>
        </>
      )}

      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 mb-8 bg-blue-50 flex flex-col items-center justify-center text-center">
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
