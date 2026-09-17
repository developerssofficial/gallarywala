import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

async function inspectGenericAnime() {
  const { data, error } = await supabase.from("images").select("*").in("id", [7, 8, 9, 10, 11, 12, 13, 14]);
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

inspectGenericAnime();
