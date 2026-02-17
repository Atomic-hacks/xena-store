import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

function signCloudinaryParams(
  params: Record<string, string>,
  apiSecret: string
): string {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "xena-store";

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing image file." }, { status: 400 });
    }

    const maxMb = Number(process.env.CLOUDINARY_MAX_UPLOAD_MB ?? "8");
    const maxBytes = Math.max(1, Math.round(maxMb * 1024 * 1024));
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Image is too large. Max allowed is ${maxMb}MB.` },
        { status: 400 }
      );
    }

    const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!acceptedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPG, PNG, WEBP, or AVIF." },
        { status: 400 }
      );
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);

    const payload = new FormData();
    payload.append("file", file);
    payload.append("folder", folder);
    payload.append("timestamp", timestamp);
    payload.append("api_key", apiKey);
    payload.append("signature", signature);

    logger.info("cloudinary.upload.request", {
      size: file.size,
      type: file.type || "unknown",
    });

    const upload = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: payload,
      }
    );

    const body = (await upload.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!upload.ok || !body.secure_url) {
      logger.warn("cloudinary.upload.failed", {
        status: upload.status,
        hasMessage: Boolean(body.error?.message),
      });
      return NextResponse.json(
        { error: body.error?.message ?? "Failed to upload image." },
        { status: 400 }
      );
    }

    return NextResponse.json({ url: body.secure_url });
  } catch (error) {
    logger.error("api.admin.uploads.cloudinary.error");
    if (error instanceof Error) {
      logger.error("api.admin.uploads.cloudinary.error.stack", { name: error.name });
    }
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
