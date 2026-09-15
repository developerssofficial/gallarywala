import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

async function listAll() {
  const { data, error } = await supabase.from("images").select("id, title, category, tags, author_name, image_url").order("id", { ascending: true });
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(`Total images: ${data.length}`);
  data.forEach((img) => {
    console.log(`[ID: ${img.id}] Title: "${img.title}" | Category: "${img.category}" | Tags: ${JSON.stringify(img.tags)} | URL: ${img.image_url}`);
  });
}

listAll();
