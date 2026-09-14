import { CATEGORIES } from "../src/data/mockPins.js";
import fs from "fs";

const today = new Date().toISOString().split("T")[0];
const baseUrl = "https://gallarywala.vercel.app";

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

// Add each category
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

// Add static info pages
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
console.log(`✅ SITEMAP_GENERATED_SUCCESSFULLY: ${CATEGORIES.length} categories generated.`);
