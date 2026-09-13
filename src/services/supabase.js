import { createClient } from "@supabase/supabase-js";

const STORAGE_KEYS = {
  SUPABASE_URL: "gallarywala_supabase_url_v1",
  SUPABASE_ANON_KEY: "gallarywala_supabase_anon_key_v1"
};

// Default or stored credentials
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

export const getSupabaseConfig = () => {
  try {
    const url = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || DEFAULT_URL;
    const key = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || DEFAULT_KEY;
    return { url, key };
  } catch {
    return { url: DEFAULT_URL, key: DEFAULT_KEY };
  }
};

export const saveSupabaseConfig = (url, key) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, key.trim());
  } catch (e) {
    console.error("Failed to save Supabase config", e);
  }
};

let supabaseClient = null;

export const getSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  if (url && key) {
    if (!supabaseClient || supabaseClient.supabaseUrl !== url) {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    }
    return supabaseClient;
  }
  return null;
};

/**
 * Supabase Auth API
 */
export const signUpWithEmail = async (email, password, fullName) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured. Please add your Project URL and Anon Key in Settings.");
  }
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "GallaryWala User",
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`
      }
    }
  });
  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email, password) => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured. Please add your Project URL and Anon Key in Settings.");
  }
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error("Supabase is not configured. Please add your Project URL and Anon Key in Settings.");
  }
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
  return data;
};

export const signOutUser = async () => {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) throw error;
};

export const updateUserProfile = async ({ fullName, username, avatarUrl }) => {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.auth.updateUser({
    data: {
      full_name: fullName,
      username: username,
      avatar_url: avatarUrl
    }
  });
  if (error) throw error;
  return data.user;
};

/**
 * Supabase Images Database API
 */
export const fetchImagesFromSupabase = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase images table query error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Error querying Supabase:", err);
    return null;
  }
};

export const insertImageToSupabase = async (imageData) => {
  const client = getSupabaseClient();
  if (!client) return imageData;

  try {
    const record = {
      title: imageData.title,
      description: imageData.description || "",
      image_url: imageData.imageUrl,
      category: imageData.category || "General",
      tags: imageData.tags || [],
      likes: imageData.likes || 0,
      link: imageData.link || null,
      author_name: imageData.author?.name || "Anonymous",
      author_avatar: imageData.author?.avatar || "",
      author_username: imageData.author?.username || "@user"
    };

    const { data, error } = await client
      .from("images")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.warn("Supabase insert error:", error);
      return imageData;
    }

    return {
      ...imageData,
      id: "sp-" + data.id,
      createdAt: data.created_at
    };
  } catch (err) {
    console.warn("Supabase insert error:", err);
    return imageData;
  }
};

export const updateImageInSupabase = async (id, updatedData) => {
  const client = getSupabaseClient();
  if (!client) return;

  const rawId = String(id).replace(/^sp-/, "");
  try {
    const updateRecord = {};
    if (updatedData.title !== undefined) updateRecord.title = updatedData.title;
    if (updatedData.description !== undefined) updateRecord.description = updatedData.description;
    if (updatedData.category !== undefined) updateRecord.category = updatedData.category;
    if (updatedData.tags !== undefined) updateRecord.tags = updatedData.tags;
    if (updatedData.likes !== undefined) updateRecord.likes = updatedData.likes;
    if (updatedData.link !== undefined) updateRecord.link = updatedData.link;

    await client.from("images").update(updateRecord).eq("id", rawId);
  } catch (err) {
    console.warn("Supabase update error:", err);
  }
};

export const deleteImageFromSupabase = async (id) => {
  const client = getSupabaseClient();
  if (!client) return;

  const rawId = id.replace(/^sp-/, "");
  try {
    await client.from("images").delete().eq("id", rawId);
  } catch (err) {
    console.warn("Supabase delete error:", err);
  }
};

export const SUPABASE_SQL_SCHEMA = `-- Run this in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS public.images (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  link TEXT,
  author_name TEXT DEFAULT 'Anonymous',
  author_avatar TEXT,
  author_username TEXT DEFAULT '@user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.images FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access" 
ON public.images FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access" 
ON public.images FOR UPDATE USING (true);

CREATE POLICY "Allow delete access" 
ON public.images FOR DELETE USING (true);
`;
