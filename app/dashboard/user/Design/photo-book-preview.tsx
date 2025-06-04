"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export function PhotoBookPreview() {
  const [currentPage, setCurrentPage] = useState(0); // Start at 0 for cover
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
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
  console.log(
    "pdfDataUrl----",
    pdfDataUrl,
    "coverDataUrl----",
    coverDataUrl,
    "fileName----",
    fileName,
    "coverFileName----",
    coverFileName,
    "cloudinaryUrl----",
    cloudinaryUrl
  );

  useEffect(() => {
    const handleError = (error: Error) => {
      console.error("PDF loading error:", error);
      setLoading(false);
      // You might want to show an error state to the user
    };

    setHasCover(!!coverDataUrl);
    loadPDFs().catch(handleError);
  }, [pdfDataUrl, coverDataUrl]);

  const loadPDFs = async () => {
    try {
      setLoading(true);

      // Ensure PDF.js is loaded
      if (typeof window === "undefined") {
        throw new Error("Window object not available");
      }

      // Check if PDF.js is loaded, if not, load it
      if (!(window as any).pdfjsLib) {
        // Load PDF.js dynamically
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
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
      const pdf = await pdfjsLib.getDocument(pdfDataUrl).promise;
      setPdfDoc(pdf);
      const pdfPageCount = pdf.numPages;

      // Load cover PDF if available
      let coverPageCount = 0;
      if (coverDataUrl) {
        try {
          const coverPdf = await pdfjsLib.getDocument(coverDataUrl).promise;
          setCoverDoc(coverPdf);
          coverPageCount = 1; // Cover should have exactly 1 page
        } catch (coverError) {
          console.error("Error loading cover PDF:", coverError);
        }
      }

      // Total pages = cover + PDF pages
      setTotalPages(pdfPageCount + coverPageCount);

      // Render initial page (cover if available, otherwise first PDF page)
      if (coverDoc || coverDataUrl) {
        await renderCoverPage();
      } else {
        renderPage(1, pdf);
      }
    } catch (error) {
      console.error("Error loading PDFs:", error);
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

        // Load cover PDF and render first page
        const coverPdf = await pdfjsLib.getDocument(coverDataUrl).promise;
        const page = await coverPdf.getPage(2); // Cover should have exactly 1 page
        const viewport = page.getViewport({ scale: zoom, rotation });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

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
    canvas.width = 600 * zoom;
    canvas.height = 800 * zoom;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw cover content
    ctx.fillStyle = "#333";
    ctx.font = `${24 * zoom}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("Book Cover", canvas.width / 2, canvas.height / 2);

    ctx.font = `${16 * zoom}px Arial`;
    ctx.fillStyle = "#666";
    ctx.fillText(
      coverFileName || "Cover PDF",
      canvas.width / 2,
      canvas.height / 2 + 40 * zoom
    );
  };

  const renderPage = async (pageNum: number, pdf?: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const pdfDocument = pdf || pdfDoc;
      if (!pdfDocument) return;

      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: zoom, rotation });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error("Error rendering page:", error);
      renderFallbackPage(pageNum);
    }
  };

  const renderFallbackPage = (pageNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600 * zoom;
    canvas.height = 800 * zoom;

    // Clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw page content
    ctx.fillStyle = "#333";
    ctx.font = `${24 * zoom}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2);

    ctx.font = `${16 * zoom}px Arial`;
    ctx.fillStyle = "#666";
    ctx.fillText(
      fileName as string,
      canvas.width / 2,
      canvas.height / 2 + 40 * zoom
    );
  };

  useEffect(() => {
    if (currentPage === 0 && hasCover) {
      renderCoverPage();
    } else if (pdfDoc) {
      const pdfPageNum = hasCover ? currentPage : currentPage + 1;
      renderPage(pdfPageNum);
    } else {
      const pdfPageNum = hasCover ? currentPage : currentPage + 1;
      renderFallbackPage(pdfPageNum);
    }
  }, [currentPage, zoom, rotation, pdfDoc, coverDoc, hasCover]);

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
        .then((response) => response.blob())
        .then((blob) => {
          // Create a blob URL for the PDF
          const blobUrl = URL.createObjectURL(blob);

          // Create a temporary anchor element for download
          const link = document.createElement("a");
          link.href = blobUrl;

          // Ensure the filename has .pdf extension
          const downloadFileName = fileName?.endsWith(".pdf")
            ? fileName
            : `${fileName}.pdf`;
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
    link.href = canvas.toDataURL();
    link.click();
  };

  const getPageLabel = () => {
    if (currentPage === 0 && hasCover) {
      return "Cover";
    }
    const pdfPageNum = hasCover ? currentPage : currentPage + 1;
    return `Page ${pdfPageNum}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
                <div className="flex items-center text-sm text-blue-600 mr-2">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Cover
                </div>
              )}
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
                      link.href = canvas.toDataURL();
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
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: "transform 0.2s ease-in-out",
              }}
            />
          </div>

          {/* Page Navigation */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-center mt-2 text-sm text-gray-600">
              {hasCover && (
                <span className="mr-4">Cover | Pages 1-{totalPages - 1}</span>
              )}
              <span>Use arrow keys to navigate</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

{
  /* <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
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
</div> */
}
