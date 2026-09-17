import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

async function inspect() {
  const { data, error } = await supabase.from("images").select("*");
  if (error) {
    console.error("Error fetching images:", error);
    return;
  }
  console.log(`Found ${data.length} images in Supabase:`);
  console.log(JSON.stringify(data, null, 2));
}

inspect();
