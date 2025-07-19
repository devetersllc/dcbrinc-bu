import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageBlob = formData.get("image") as Blob;
    const fileName = formData.get("fileName") as string;

    if (!imageBlob) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadCardImageToCloudinary(buffer, fileName);

    return NextResponse.json({
      success: true,
      imageUrl: cloudinaryUrl,
    });
  } catch (error) {
    console.error("Error uploading card image:", error);
    return NextResponse.json(
      { error: "Failed to upload card image" },
      { status: 500 }
    );
  }
}

async function uploadCardImageToCloudinary(buffer: Buffer, fileName: string) {
  const cloudName = "dcdynkm5d";

  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME not configured");
  }

  // Convert buffer to blob
  const blob = new Blob([buffer], { type: "image/png" });
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `card_${timestamp}_${fileName.replace(
    /[^a-zA-Z0-9]/g,
    "_"
  )}`;

  // Use unsigned upload with the preset
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", "kpgnv3dh");
  formData.append("folder", "business-cards");
  formData.append("public_id", publicId);

  try {
    console.log("Uploading card image to Cloudinary with preset: kpgnv3dh");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
    console.log("Cloudinary card image upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
