import fs from "fs";
import path from "path";

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function saveUploadedFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadResult> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`DISALLOWED_FILE_TYPE: Only PDF, Images (JPG, PNG, WEBP), CSV, and Excel are permitted.`);
  }

  if (fileBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(`FILE_TOO_LARGE: Maximum allowed upload size is 10 MB.`);
  }

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueKey = `${Date.now()}-${cleanFileName}`;
  
  // Local storage provider
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const destination = path.join(uploadDir, uniqueKey);
  fs.writeFileSync(destination, fileBuffer);

  return {
    url: `/uploads/${uniqueKey}`,
    key: uniqueKey,
    sizeBytes: fileBuffer.byteLength,
    mimeType,
  };
}
