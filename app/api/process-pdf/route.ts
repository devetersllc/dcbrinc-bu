import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate PDF properties first
    const properties = await validatePDFProperties(buffer);

    // Create PDF data URL for client-side rendering
    const pdfDataUrl = `data:application/pdf;base64,${buffer.toString(
      "base64"
    )}`;

    // Try to upload to Cloudinary if credentials are available (optional)
    let cloudinaryUrl = null;
    let publicId = null;
    let uploadSuccess = false;

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
        // Log the full error for debugging
        console.error("Full Cloudinary error:", uploadError);
      }
    } else if (!isCloudinaryConfigured()) {
      console.log("Cloudinary not configured, using local data URL");
    }

    return NextResponse.json({
      properties,
      pdfDataUrl, // Always provide data URL as primary source
      cloudinaryUrl, // Optional Cloudinary URL if upload succeeded
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

  // Convert buffer to blob
  const blob = new Blob([buffer], { type: "application/pdf" });
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `pdf_${timestamp}_${fileName.replace(/[^a-zA-Z0-9]/g, "_")}`;

  // Use unsigned upload with the preset you created
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", "kpgnv3dh"); // ✅ Use the preset you created
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

async function validatePDFProperties(buffer: Buffer) {
  const errors: string[] = [];

  try {
    // Dynamic import for pdf-parse (if available)
    let pdfParse;
    try {
      pdfParse = (await import("pdf-parse")).default;
    } catch (importError) {
      console.warn("pdf-parse not available, using fallback validation");
      return fallbackValidation(buffer);
    }

    const pdfData = await pdfParse(buffer);
    const pageCount = pdfData.numpages;

    // Validate page count
    if (pageCount < 2 || pageCount > 800) {
      errors.push(`Page count (${pageCount}) must be between 2 and 800`);
    }

    // Check PDF content for fonts and layers (simplified)
    const content = buffer.toString("binary");

    // Check for embedded fonts
    const hasEmbeddedFonts =
      content.includes("/FontDescriptor") &&
      (content.includes("/FontFile") ||
        content.includes("/FontFile2") ||
        content.includes("/FontFile3"));

    if (!hasEmbeddedFonts) {
      errors.push("PDF should have embedded fonts for better compatibility");
    }

    // Check for layers
    const hasLayers =
      content.includes("/OCG") ||
      content.includes("/OCProperties") ||
      content.includes("/Layer");
    if (hasLayers) {
      errors.push("PDF should have flattened layers (layers detected)");
    }

    return {
      fileType: "PDF",
      pageCount,
      fontsEmbedded: hasEmbeddedFonts,
      layersFlattened: !hasLayers,
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return fallbackValidation(buffer);
  }
}

function fallbackValidation(buffer: Buffer) {
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

  // Validate page count
  if (pageCount < 2 || pageCount > 800) {
    errors.push(`Page count (${pageCount}) must be between 2 and 800`);
  }

  // Check for embedded fonts (simplified check)
  const hasEmbeddedFonts =
    content.includes("/FontDescriptor") && content.includes("/FontFile");

  // Check for layers (simplified check)
  const hasLayers =
    content.includes("/OCG") || content.includes("/OCProperties");

  return {
    fileType: "PDF",
    pageCount,
    fontsEmbedded: hasEmbeddedFonts,
    layersFlattened: !hasLayers,
    valid: errors.length === 0,
    errors,
  };
}
