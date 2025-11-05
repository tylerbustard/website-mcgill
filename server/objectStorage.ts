import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || "";
const PRIVATE_DIR = process.env.PRIVATE_OBJECT_DIR || ".private";

if (!BUCKET_ID) {
  console.warn("Warning: No DEFAULT_OBJECT_STORAGE_BUCKET_ID found in environment variables");
}

// Initialize S3 client for Replit Object Storage
const s3Client = new S3Client({
  endpoint: "https://storage.googleapis.com",
  region: "auto",
  credentials: {
    accessKeyId: process.env.REPL_ID || "local-dev",
    secretAccessKey: process.env.REPL_OWNER || "local-dev"
  },
  forcePathStyle: true
});

export interface UploadedFile {
  key: string;
  url: string;
  size: number;
}

// Upload a file to object storage
export async function uploadToObjectStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadedFile> {
  const key = `${PRIVATE_DIR}/resumes/${Date.now()}-${filename}`;
  
  try {
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_ID,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        originalName: filename,
        uploadedAt: new Date().toISOString()
      }
    }));

    // Generate a presigned URL for accessing the file
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_ID,
        Key: key
      }),
      { expiresIn: 3600 * 24 * 30 } // 30 days
    );

    return {
      key,
      url,
      size: buffer.length
    };
  } catch (error) {
    console.error("Error uploading to object storage:", error);
    throw new Error("Failed to upload file to cloud storage");
  }
}

// Get a file from object storage
export async function getFromObjectStorage(key: string): Promise<{
  stream: Readable;
  contentType?: string;
  size?: number;
}> {
  try {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: BUCKET_ID,
      Key: key
    }));

    return {
      stream: response.Body as Readable,
      contentType: response.ContentType,
      size: response.ContentLength
    };
  } catch (error) {
    console.error("Error getting from object storage:", error);
    throw new Error("Failed to retrieve file from cloud storage");
  }
}

// Delete a file from object storage
export async function deleteFromObjectStorage(key: string): Promise<void> {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_ID,
      Key: key
    }));
  } catch (error) {
    console.error("Error deleting from object storage:", error);
    throw new Error("Failed to delete file from cloud storage");
  }
}

// Generate a presigned URL for a file
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    return await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: BUCKET_ID,
        Key: key
      }),
      { expiresIn }
    );
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate file URL");
  }
}

// Check if object storage is configured
export function isObjectStorageConfigured(): boolean {
  return !!BUCKET_ID;
}