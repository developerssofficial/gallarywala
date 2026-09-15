import { CATEGORIES } from "../src/data/mockPins.js";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

const today = new Date().toISOString().split("T")[0];
const baseUrl = "https://gallarywala.vercel.app";

async function generate() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // 1. Add each Category
  for (const cat of CATEGORIES) {
    if (cat === "All") continue;
    const encoded = encodeURIComponent(cat).replace(/%20/g, "+");
    xml += `  <url>
    <loc>${baseUrl}/?category=${encoded}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
  }

  // 2. Add High-Volume Anime Character Searches
  const popularKeywords = [
    "naruto",
    "itachi",
    "itachi uchiha",
    "kakashi",
    "kakashi hatake",
    "sasuke",
    "sasuke uchiha",
    "gojo",
    "gojo satoru",
    "hollow purple",
    "unlimited void",
    "jujutsu kaisen",
    "jjk",
    "levi",
    "levi ackerman",
    "eren",
    "eren yeager",
    "attack on titan",
    "aot",
    "toji",
    "toji fushiguro",
    "loid",
    "loid forger",
    "spy x family",
    "4k wallpaper",
    "anime 4k wallpaper",
    "dark anime",
    "cyberpunk",
    "tokyo nights",
    "classic cars",
    "porsche"
  ];

  for (const kw of popularKeywords) {
    const encoded = encodeURIComponent(kw).replace(/%20/g, "+");
    xml += `  <url>
    <loc>${baseUrl}/?q=${encoded}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
  }

  // 3. Fetch all images from Supabase to create direct Image Search entries
  try {
    const { data: images } = await supabase.from("images").select("*").order("id", { ascending: true });
    if (images && images.length > 0) {
      for (const img of images) {
        xml += `  <url>
    <loc>${baseUrl}/?pin=sp-${img.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${img.image_url}</image:loc>
      <image:title><![CDATA[${img.title}]]></image:title>
      <image:caption><![CDATA[${img.description || img.title}]]></image:caption>
    </image:image>
  </url>
`;
      }
      console.log(`✓ Added ${images.length} direct Image Search entries to sitemap!`);
    }
  } catch (err) {
    console.warn("Could not fetch Supabase images for sitemap", err);
  }

  // 4. Add static info pages
  const staticPages = [
    { path: "/privacy.html", priority: "0.5", freq: "monthly" },
    { path: "/terms.html", priority: "0.5", freq: "monthly" }
  ];

  for (const p of staticPages) {
    xml += `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync("./public/sitemap.xml", xml, "utf8");
  console.log(`✅ SITEMAP_GENERATED_SUCCESSFULLY with full character & image index!`);
}

generate();
