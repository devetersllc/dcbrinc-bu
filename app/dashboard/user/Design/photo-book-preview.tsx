"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export function PhotoBookPreview() {
  const [currentPage, setCurrentPage] = useState(0); // Start at 0 for cover
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [coverDoc, setCoverDoc] = useState<any>(null);
  const [hasCover, setHasCover] = useState(false);
  const pdfDataUrl = useSelector(
    (state: RootState) => state.design.processedPDF?.pdfDataUrl
  );
  const fileName = useSelector(
    (state: RootState) => state.design.processedPDF?.fileName
  );
  const cloudinaryUrl = useSelector(
    (state: RootState) => state.design.processedPDF?.cloudinaryUrl
  );
  const coverDataUrl = useSelector(
    (state: RootState) => state.design.processedCover?.coverDataUrl
  );
  const coverFileName = useSelector(
    (state: RootState) => state.design.processedCover?.coverFileName
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error("PDF loading error:", error);
      setLoading(false);
    };

    setHasCover(!!coverDataUrl);
    loadPDFs().catch(handleError);
  }, [pdfDataUrl, coverDataUrl]);

  const loadPDFs = async () => {
    try {
      setLoading(true);

      // Ensure we're in browser environment
      if (typeof window === "undefined") {
        throw new Error("Window object not available");
      }

      // Check if PDF.js is loaded, if not, load it
      if (!(window as any).pdfjsLib) {
        // Load PDF.js dynamically
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.crossOrigin = "anonymous"; // Add crossOrigin attribute
        document.head.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        // Set worker
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      }

      const pdfjsLib = (window as any).pdfjsLib;

      // Validate pdfDataUrl
      if (!pdfDataUrl) {
        throw new Error("No PDF data available");
      }

      // Load main PDF
      try {
        const pdf = await pdfjsLib.getDocument({
          url: pdfDataUrl,
          withCredentials: true,
        }).promise;
        setPdfDoc(pdf);
        const pdfPageCount = pdf.numPages;

        // Load cover PDF if available
        let coverPageCount = 0;
        if (coverDataUrl) {
          try {
            const coverPdf = await pdfjsLib.getDocument({
              url: coverDataUrl,
              withCredentials: true,
            }).promise;
            setCoverDoc(coverPdf);
            coverPageCount = 1; // Cover should have exactly 1 page
          } catch (coverError) {
            console.error("Error loading cover PDF:", coverError);
          }
        }

        // Total pages = cover + PDF pages
        setTotalPages(pdfPageCount + coverPageCount);

        // Render initial page (cover if available, otherwise first PDF page)
        if (coverDataUrl) {
          await renderCoverPage();
        } else {
          renderPage(1, pdf);
        }
      } catch (pdfError) {
        console.error("Error loading main PDF:", pdfError);
        setTotalPages(1 + (coverDataUrl ? 1 : 0));
        if (coverDataUrl) {
          await renderCoverPage();
        } else {
          renderFallbackPage(1);
        }
      }
    } catch (error) {
      console.error("Error in loadPDFs:", error);
      setTotalPages(1 + (coverDataUrl ? 1 : 0));
      if (coverDataUrl) {
        await renderCoverPage();
      } else {
        renderFallbackPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderCoverPage = async () => {
    if (!coverDataUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      if (typeof window !== "undefined" && (window as any).pdfjsLib) {
        const pdfjsLib = (window as any).pdfjsLib;

        // Use existing coverDoc if available, otherwise load it
        let coverPdf = coverDoc;
        if (!coverPdf) {
          coverPdf = await pdfjsLib.getDocument(coverDataUrl).promise;
          setCoverDoc(coverPdf);
        }

        const page = await coverPdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        // Set canvas dimensions first
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      }
    } catch (error) {
      console.error("Error rendering cover page:", error);
      renderFallbackCover();
    }
  };
  const renderFallbackCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 800;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw cover content
    ctx.fillStyle = "#333";
    ctx.font = `24px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Book Cover", canvas.width / 2, canvas.height / 2);

    ctx.font = `16px Arial`;
    ctx.fillStyle = "#666";
    ctx.fillText(
      coverFileName || "Cover PDF",
      canvas.width / 2,
      canvas.height / 2 + 40
    );
  };

  const renderPage = async (pageNum: number, pdf?: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pdfDocument = pdf || pdfDoc;
      if (!pdfDocument) {
        renderFallbackPage(pageNum);
        return;
      }

      // Make sure pageNum is within valid range
      if (pageNum < 1 || pageNum > pdfDocument.numPages) {
        console.error(
          `Invalid page number: ${pageNum}. PDF has ${pdfDocument.numPages} pages.`
        );
        renderFallbackPage(pageNum);
        return;
      }

      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });

      // Set canvas dimensions first
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error(`Error rendering page ${pageNum}:`, error);
      renderFallbackPage(pageNum);
    }
  };

  const renderFallbackPage = (pageNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 800;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw page content
    ctx.fillStyle = "#333";
    ctx.font = `24px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2);

    ctx.font = `16px Arial`;
    ctx.fillStyle = "#666";
    ctx.fillText(
      fileName || "PDF Document",
      canvas.width / 2,
      canvas.height / 2 + 40
    );
  };

  useEffect(() => {
    const renderCurrentPage = async () => {
      if (currentPage === 0 && hasCover) {
        await renderCoverPage();
      } else {
        const pdfPageNum = hasCover ? currentPage : currentPage + 1;
        if (pdfDoc) {
          await renderPage(pdfPageNum);
        } else {
          renderFallbackPage(pdfPageNum);
        }
      }
    };

    renderCurrentPage();
  }, [currentPage, pdfDoc, coverDoc, hasCover]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") nextPage();
    if (event.key === "ArrowLeft") prevPage();
    if (event.key === "Escape") setIsFullscreen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, totalPages]);

  const downloadPDF = () => {
    // If we have a Cloudinary URL, use it for downloading the full PDF
    if (cloudinaryUrl) {
      // Create a fetch request to get the PDF as a blob
      fetch(cloudinaryUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          // Create a blob URL for the PDF
          const blobUrl = URL.createObjectURL(blob);

          // Create a temporary anchor element for download
          const link = document.createElement("a");
          link.href = blobUrl;

          // Ensure the filename has .pdf extension
          const downloadFileName = fileName?.endsWith(".pdf")
            ? fileName
            : `${fileName || "document"}.pdf`;
          link.download = downloadFileName;

          // Append to body, click, and remove
          document.body.appendChild(link);
          link.click();

          // Clean up
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        })
        .catch((error) => {
          console.error("Error downloading PDF:", error);
          alert("Failed to download PDF. Please try again.");
        });
      return;
    }

    // Fallback: download current page as image
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    const pageLabel =
      currentPage === 0 && hasCover
        ? "cover"
        : `page-${hasCover ? currentPage : currentPage + 1}`;
    link.download = `${pageLabel}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getPageLabel = () => {
    if (currentPage === 0 && hasCover) {
      return "Cover";
    }
    const pdfPageNum = hasCover ? currentPage : currentPage + 1;

    // Show two pages at a time for interior PDF pages
    if (pdfPageNum === 1) {
      return `Page 1-2`;
    } else {
      const startPage = (pdfPageNum - 1) * 2 - 1;
      const endPage = Math.min(startPage + 1, totalPages - (hasCover ? 1 : 0));
      return `Page ${startPage}-${endPage}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b463c] mx-auto mb-4"></div>
          <p>Loading PDFs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
      <Card className={`${isFullscreen ? "h-full border-0 rounded-none" : ""}`}>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {getPageLabel()} of {totalPages}{" "}
                {hasCover && currentPage === 0
                  ? ""
                  : `(${totalPages - (hasCover ? 1 : 0)} PDF pages)`}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              {currentPage === 0 && hasCover && (
                <div className="flex items-center text-sm text-[#1B463C] mr-2">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Cover
                </div>
              )}

              {/* Download buttons */}
              {cloudinaryUrl ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadPDF}
                    title="Download full PDF"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">PDF</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const link = document.createElement("a");
                      const pageLabel =
                        currentPage === 0 && hasCover
                          ? "cover"
                          : `page-${hasCover ? currentPage : currentPage + 1}`;
                      link.download = `${pageLabel}.png`;
                      link.href = canvas.toDataURL("image/png");
                      link.click();
                    }}
                    title="Download current page as image"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Page</span>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadPDF}
                  title="Download current page as image"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}

              {/* Fullscreen button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* PDF Display */}
          <div
            className={`flex justify-center items-center ${
              isFullscreen ? "h-[calc(100vh-80px)]" : "h-[600px]"
            } bg-gray-100 overflow-auto`}
          >
            <canvas
              ref={canvasRef}
              className="shadow-2xl bg-white max-w-full max-h-full"
            />
          </div>

          {/* Page Navigation */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {hasCover && (
                  <span className="mr-4">Cover | Pages 1-{totalPages - 1}</span>
                )}
                <span>Use arrow keys to navigate</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
