import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";
const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

const CLOUD_NAME = "nho4ptej";
const UPLOAD_PRESET = "gallarywala_preset";

const SOURCE_DIR = "C:\\Users\\user\\Downloads\\ChatGPT_AI_Images";

async function uploadToCloudinary(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = `data:image/png;base64,${fileBuffer.toString("base64")}`;

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.secure_url;
}

async function testSingle() {
  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Found ${files.length} files in source directory.`);
  const firstFile = path.join(SOURCE_DIR, files[0]);
  console.log(`Testing upload for: ${files[0]}`);
  const url = await uploadToCloudinary(firstFile);
  console.log(`Cloudinary Upload Success: ${url}`);
}

testSingle().catch(console.error);
