import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cover") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No cover file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Cover file must be a PDF" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate cover properties
    const properties = await validateCoverProperties(buffer);

    // Create cover data URL for PDF.js rendering
    const coverDataUrl = `data:application/pdf;base64,${buffer.toString(
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
          "pdf-covers"
        );
        if (uploadResult && uploadResult.secure_url) {
          cloudinaryUrl = uploadResult.secure_url;
          publicId = uploadResult.public_id;
          uploadSuccess = true;
          console.log("Cover uploaded to Cloudinary:", cloudinaryUrl);
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
      coverDataUrl, // Always provide data URL as primary source
      cloudinaryUrl, // Optional Cloudinary URL if upload succeeded
      publicId,
      coverFileName: file.name,
      fileSize: file.size,
      uploadSuccess,
    });
  } catch (error) {
    console.error("Error processing cover:", error);
    return NextResponse.json(
      { error: "Failed to process cover" },
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
  const publicId = `cover_${timestamp}_${fileName.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  )}`;

  // Use unsigned upload with the preset you created
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", "kpgnv3dh"); // ✅ Use the same preset
  formData.append("folder", folder);
  formData.append("public_id", publicId);

  try {
    console.log("Uploading cover to Cloudinary with preset: kpgnv3dh");
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
    console.log("Cloudinary cover upload successful:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

async function validateCoverProperties(buffer: Buffer) {
  const errors: string[] = [];

  try {
    // Dynamic import for pdf-parse
    let pdfParse;
    try {
      pdfParse = require("pdf-parse");
      // pdfParse = (await import("pdf-parse")).default;
    } catch (importError) {
      console.warn("pdf-parse not available, using fallback validation");
      return fallbackCoverValidation(buffer);
    }

    const pdfData = await pdfParse(buffer);
    const pageCount = pdfData.numpages;

    // Validate page count (must be exactly 1)
    if (pageCount !== 1) {
      errors.push(`Cover must have exactly 1 page (found ${pageCount} pages)`);
    }

    // Check PDF content for fonts and layers
    const content = buffer.toString("binary");

    // Check for embedded fonts
    const hasEmbeddedFonts =
      content.includes("/FontDescriptor") &&
      (content.includes("/FontFile") ||
        content.includes("/FontFile2") ||
        content.includes("/FontFile3"));

    if (!hasEmbeddedFonts) {
      // errors.push("Cover PDF must have embedded fonts");
    }

    // Check for layers
    const hasLayers =
      content.includes("/OCG") ||
      content.includes("/OCProperties") ||
      content.includes("/Layer");
    if (hasLayers) {
      // errors.push("Cover PDF must have flattened layers (layers detected)");
    }

    // Extract dimensions (simplified approach)
    const dimensions = extractDimensions(content);

    // Validate dimensions: 16.79 x 11.94 inches (426.47mm x 303.28mm)
    const expectedWidth = 16.79;
    const expectedHeight = 11.94;
    const tolerance = 0.1; // Allow 0.1 inch tolerance

    if (dimensions.width && dimensions.height) {
      const widthDiff = Math.abs(dimensions.width - expectedWidth);
      const heightDiff = Math.abs(dimensions.height - expectedHeight);

      if (widthDiff > tolerance || heightDiff > tolerance) {
        // errors.push(
        //   `Cover dimensions must be 16.79 x 11.94 inches (found ${dimensions.width.toFixed(
        //     2
        //   )} x ${dimensions.height.toFixed(2)} inches)`
        // );
      }
    } else {
      // errors.push("Could not determine cover dimensions");
    }

    // Check spine width (should be 0)
    if (content.includes("/Spine") || content.includes("spine")) {
      // errors.push("Cover must have 0 inch spine width");
    }

    return {
      fileType: "PDF",
      pageCount,
      fontsEmbedded: hasEmbeddedFonts,
      layersFlattened: !hasLayers,
      dimensions: {
        width: dimensions.width || 0,
        height: dimensions.height || 0,
        unit: "inches",
      },
      valid: errors.length === 0,
      errors,
    };
  } catch (error) {
    console.error("Error parsing cover PDF:", error);
    return fallbackCoverValidation(buffer);
  }
}

function extractDimensions(content: string) {
  // Simplified dimension extraction
  const mediaBoxMatch = content.match(
    /\/MediaBox\s*\[\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\]/
  );

  if (mediaBoxMatch) {
    const width =
      (Number.parseFloat(mediaBoxMatch[3]) -
        Number.parseFloat(mediaBoxMatch[1])) /
      72; // Convert points to inches
    const height =
      (Number.parseFloat(mediaBoxMatch[4]) -
        Number.parseFloat(mediaBoxMatch[2])) /
      72;
    return { width, height };
  }

  return { width: null, height: null };
}

function fallbackCoverValidation(buffer: Buffer) {
  const errors: string[] = [];

  // Basic PDF validation
  const pdfHeader = buffer.toString("ascii", 0, 8);
  if (!pdfHeader.startsWith("%PDF-")) {
    errors.push("Invalid PDF file format");
  }

  // Estimate page count
  const content = buffer.toString("binary");
  const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
  const pageCount = pageMatches ? pageMatches.length : 1;

  if (pageCount !== 1) {
    errors.push(`Cover must have exactly 1 page (found ${pageCount} pages)`);
  }

  // Check for embedded fonts
  const hasEmbeddedFonts =
    content.includes("/FontDescriptor") && content.includes("/FontFile");
  if (!hasEmbeddedFonts) {
    // errors.push("Cover PDF should have embedded fonts");
  }

  // Check for layers
  const hasLayers =
    content.includes("/OCG") || content.includes("/OCProperties");
  if (hasLayers) {
    errors.push("Cover PDF should have flattened layers");
  }

  return {
    fileType: "PDF",
    pageCount,
    fontsEmbedded: hasEmbeddedFonts,
    layersFlattened: !hasLayers,
    dimensions: {
      width: 16.79, // Default expected dimensions
      height: 11.94,
      unit: "inches",
    },
    valid: errors.length === 0,
    errors,
  };
}
