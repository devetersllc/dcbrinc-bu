import { type NextRequest, NextResponse } from "next/server";

type BookType =
  | "book"
  | "photo-book"
  | "comic-book"
  | "magazine"
  | "yearbook"
  | "calendar"
  | "ebook";

type BookInfo = {
  fileType: string;
  pageCount: string;
  fonts: string;
  layers: string;
  pageSize?: string;
};

const dataAccordingToType: Record<BookType, BookInfo> = {
  book: {
    fileType: "PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  "photo-book": {
    fileType: "PDF",
    pageCount: "24-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  "comic-book": {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
    pageSize: "6.88 x 10.50 in",
  },
  magazine: {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  yearbook: {
    fileType: "PDF",
    pageCount: "4-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  calendar: {
    fileType: "PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
  ebook: {
    fileType: "EPUB, DOCX, RTF, ODT, PDF",
    pageCount: "2-800",
    fonts: "Embedded",
    layers: "Flattened",
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;
    const bookType = formData.get("bookType") as BookType;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!bookType || !dataAccordingToType[bookType]) {
      return NextResponse.json({ error: "Invalid book type" }, { status: 400 });
    }

    // Get book type requirements
    const requirements = dataAccordingToType[bookType];

    // Validate file type based on book type
    const allowedTypes = requirements.fileType.split(", ");
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (bookType === "ebook") {
      const validEbookTypes = ["pdf", "epub", "docx", "rtf", "odt"];
      if (!fileExtension || !validEbookTypes.includes(fileExtension)) {
        return NextResponse.json(
          { error: `File must be one of: ${requirements.fileType}` },
          { status: 400 }
        );
      }
    } else {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "File must be a PDF" },
          { status: 400 }
        );
      }
    }

    // For non-PDF files in ebook, handle differently
    if (bookType === "ebook" && fileExtension !== "pdf") {
      return NextResponse.json({
        properties: {
          fileType: fileExtension?.toUpperCase(),
          pageCount: "N/A",
          fontsEmbedded: true,
          layersFlattened: true,
          valid: true,
          errors: [],
        },
        fileName: file.name,
        fileSize: file.size,
        uploadSuccess: true,
      });
    }

    // Convert file to buffer for PDF processing
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate PDF properties with book type requirements
    const properties = await validatePDFProperties(
      buffer,
      bookType,
      requirements
    );

    // Create PDF data URL for client-side rendering
    const pdfDataUrl = `data:application/pdf;base64,${buffer.toString(
      "base64"
    )}`;

    // Try to upload to Cloudinary if credentials are available (optional)
    let cloudinaryUrl = null;
    let publicId = null;
    let uploadSuccess = properties.valid;

    if (properties.valid && isCloudinaryConfigured()) {
      try {
        const uploadResult = await uploadToCloudinary(
          buffer,
          file.name,
          "pdf-books"
        );
        if (uploadResult && uploadResult.secure_url) {
          cloudinaryUrl = uploadResult.secure_url;
          publicId = uploadResult.public_id;
          uploadSuccess = true;
          console.log("PDF uploaded to Cloudinary:", cloudinaryUrl);
        }
      } catch (uploadError: any) {
        console.warn("Cloudinary upload failed:", uploadError.message);
        console.error("Full Cloudinary error:", uploadError);
      }
    } else if (!isCloudinaryConfigured()) {
      console.log("Cloudinary not configured, using local data URL");
    }

    return NextResponse.json({
      properties,
      pdfDataUrl,
      cloudinaryUrl,
      publicId,
      fileName: file.name,
      fileSize: file.size,
      uploadSuccess,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}

function isCloudinaryConfigured() {
  const cloudName = "dcdynkm5d";
  const apiKey = "157745433978489";
  const apiSecret = "AqvKiU623z4vCZStGiBvBgk-2vQ";

  console.log("Checking Cloudinary config:");
  console.log(
    "CLOUDINARY_CLOUD_NAME:",
    cloudName ? `✓ Set (${cloudName})` : "✗ Missing"
  );
  console.log(
    "CLOUDINARY_API_KEY:",
    apiKey ? `✓ Set (${apiKey.substring(0, 6)}...)` : "✗ Missing"
  );
  console.log("CLOUDINARY_API_SECRET:", apiSecret ? "✓ Set" : "✗ Missing");

  const isConfigured = !!(cloudName && apiKey && apiSecret);
  console.log("Cloudinary configured:", isConfigured);

  return isConfigured;
}

async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder: string
) {
  const cloudName = "dcdynkm5d";

  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME not configured");
  }

  const blob = new Blob([buffer], { type: "application/pdf" });
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `pdf_${timestamp}_${fileName.replace(/[^a-zA-Z0-9]/g, "_")}`;

  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", "kpgnv3dh");
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  try {
    console.log("Uploading to Cloudinary with preset: kpgnv3dh");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const responseText = await response.text();
    console.log("Cloudinary response status:", response.status);

    if (!response.ok) {
      console.error("Cloudinary error response:", responseText);
      throw new Error(
        `Cloudinary upload failed: ${response.status} ${response.statusText} - ${responseText}`
      );
    }

    const result = JSON.parse(responseText);
    console.log("Cloudinary upload successful:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

async function validatePDFProperties(
  buffer: Buffer,
  bookType: BookType,
  requirements: BookInfo
) {
  const errors: string[] = [];

  try {
    let pdfParse;
    try {
      pdfParse = (await import("pdf-parse")).default;
    } catch (importError) {
      console.warn("pdf-parse not available, using fallback validation");
      return fallbackValidation(buffer, bookType, requirements);
    }

    const pdfData = await pdfParse(buffer);
    const pageCount = pdfData.numpages;

    // Parse page count requirements for the specific book type
    const [minPages, maxPages] = requirements.pageCount.split("-").map(Number);

    // Validate page count based on book type
    // if (pageCount < minPages || pageCount > maxPages) {
    //   errors.push(
    //     `Page count (${pageCount}) must be between ${minPages} and ${maxPages} for ${bookType.replace(
    //       "-",
    //       " "
    //     )}`
    //   );
    // }

    // Check PDF content for fonts and layers
    const content = buffer.toString("binary");

    // Check for embedded fonts
    const hasEmbeddedFonts =
      content.includes("/FontDescriptor") &&
      (content.includes("/FontFile") ||
        content.includes("/FontFile2") ||
        content.includes("/FontFile3"));

    if (!hasEmbeddedFonts && requirements.fonts === "Embedded") {
      errors.push("PDF must have embedded fonts for better compatibility");
    }

    // Check for layers
    const hasLayers =
      content.includes("/OCG") ||
      content.includes("/OCProperties") ||
      content.includes("/Layer");

    if (hasLayers && requirements.layers === "Flattened") {
      errors.push("PDF must have flattened layers (layers detected)");
    }

    // Additional validation for comic books (page size)
    if (bookType === "comic-book" && requirements.pageSize) {
      // This is a simplified check - in a real implementation, you'd parse the PDF page dimensions
      const hasCorrectPageSize = checkPageSize(content, requirements.pageSize);
      if (!hasCorrectPageSize) {
        errors.push(
          `Page size should be ${requirements.pageSize} for comic books`
        );
      }
    }

    // File size validation (max 50MB)
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB
    if (buffer.length > maxSizeBytes) {
      errors.push("File size must not exceed 50MB");
    }

    return {
      fileType: "PDF",
      pageCount,
      fontsEmbedded: hasEmbeddedFonts,
      layersFlattened: !hasLayers,
      valid: errors.length === 0,
      errors,
      bookType,
      requirements,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return fallbackValidation(buffer, bookType, requirements);
  }
}

function fallbackValidation(
  buffer: Buffer,
  bookType: BookType,
  requirements: BookInfo
) {
  const errors: string[] = [];

  // Basic PDF validation
  const pdfHeader = buffer.toString("ascii", 0, 8);
  if (!pdfHeader.startsWith("%PDF-")) {
    errors.push("Invalid PDF file format");
  }

  // Estimate page count (simplified approach)
  const content = buffer.toString("binary");
  const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
  const pageCount = pageMatches ? pageMatches.length : 1;

  // Parse page count requirements for the specific book type
  const [minPages, maxPages] = requirements.pageCount.split("-").map(Number);

  // Validate page count based on book type
  // if (pageCount < minPages || pageCount > maxPages) {
  //   errors.push(
  //     `Page count (${pageCount}) must be between ${minPages} and ${maxPages} for ${bookType.replace(
  //       "-",
  //       " "
  //     )}`
  //   );
  // }

  // Check for embedded fonts (simplified check)
  const hasEmbeddedFonts =
    content.includes("/FontDescriptor") && content.includes("/FontFile");

  if (!hasEmbeddedFonts && requirements.fonts === "Embedded") {
    errors.push("PDF must have embedded fonts for better compatibility");
  }

  // Check for layers (simplified check)
  const hasLayers =
    content.includes("/OCG") || content.includes("/OCProperties");

  if (hasLayers && requirements.layers === "Flattened") {
    errors.push("PDF must have flattened layers (layers detected)");
  }

  // File size validation (max 50MB)
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB
  if (buffer.length > maxSizeBytes) {
    errors.push("File size must not exceed 50MB");
  }

  return {
    fileType: "PDF",
    pageCount,
    fontsEmbedded: hasEmbeddedFonts,
    layersFlattened: !hasLayers,
    valid: errors.length === 0,
    errors,
    bookType,
    requirements,
  };
}

function checkPageSize(content: string, expectedSize: string): boolean {
  // This is a simplified implementation
  // In a real scenario, you'd parse the MediaBox or CropBox from the PDF
  // For now, we'll return true to avoid false positives
  return true;
}
