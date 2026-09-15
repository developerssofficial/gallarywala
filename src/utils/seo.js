/**
 * GallaryWala Dynamic SEO & Schema.org Structured Data Engine
 * Automatically optimizes Meta Tags, Open Graph, Twitter Cards, and Google Image Search JSON-LD
 */

const SITE_NAME = "GallaryWala";
const BASE_URL = "https://gallarywala.vercel.app";
const DEFAULT_IMAGE = "https://gallarywala.vercel.app/logo.png";
const DEFAULT_DESC = "Discover, download, and license ultra high-resolution 4K wallpapers, anime art, cyberpunk renders, and commercial visual media on GallaryWala.";

function setMetaTag(attrName, attrValue, content) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function injectSchemaJson(schemaId, jsonData) {
  let script = document.getElementById(schemaId);
  if (!script) {
    script = document.createElement("script");
    script.id = schemaId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonData, null, 2);
}

/**
 * Updates full SEO state dynamically for Pin views, Category views, and Home
 */
export function updatePageSEO({
  pin = null,
  category = "All",
  searchQuery = "",
  customTitle = "",
  customDescription = ""
} = {}) {
  try {
    let title = "";
    let description = "";
    let ogImage = DEFAULT_IMAGE;
    let canonicalUrl = BASE_URL;
    let keywords = [
      "4k wallpapers",
      "hd backgrounds",
      "digital art",
      "gallarywala",
      "desktop wallpapers",
      "mobile wallpapers",
      "aesthetic visual art"
    ];

    if (pin) {
      // 1. PIN / IMAGE DETAILS VIEW SEO
      const pinTitle = pin.title || pin.category || "Visual Art";
      const pinCategory = pin.category || "Wallpapers";
      const authorName = pin.author?.name || "GallaryWala Creator";
      
      title = `${pinTitle} — ${pinCategory} 4K Wallpaper & Art | GallaryWala`;
      description = pin.description
        ? `${pin.description.slice(0, 150)}... Download high-resolution 4K wallpaper "${pinTitle}" in ${pinCategory} by ${authorName}.`
        : `Download "${pinTitle}" free in ultra HD 4K resolution. Explore stunning ${pinCategory} wallpapers, backgrounds, and digital art created by ${authorName} on GallaryWala.`;
      
      ogImage = pin.imageUrl || DEFAULT_IMAGE;
      canonicalUrl = `${BASE_URL}/?pin=${encodeURIComponent(pin.id)}`;
      
      if (Array.isArray(pin.tags)) {
        keywords = [...new Set([...keywords, ...pin.tags, pinCategory.toLowerCase()])];
      }

      // Inject Schema.org ImageObject for Google Images indexing
      injectSchemaJson("dynamic-seo-image-schema", {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "@id": canonicalUrl,
        "name": pinTitle,
        "caption": pinTitle,
        "description": description,
        "contentUrl": pin.imageUrl,
        "thumbnailUrl": pin.imageUrl,
        "encodingFormat": "image/webp",
        "author": {
          "@type": "Person",
          "name": authorName,
          "url": pin.author?.username ? `${BASE_URL}/?user=${encodeURIComponent(pin.author.username)}` : BASE_URL
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "logo": {
            "@type": "ImageObject",
            "url": DEFAULT_IMAGE
          }
        },
        "license": pin.isPaid ? `${BASE_URL}/terms.html` : "https://creativecommons.org/publicdomain/zero/1.0/",
        "acquireLicensePage": canonicalUrl
      });

    } else if (searchQuery) {
      // 2. SEARCH RESULTS SEO
      title = `"${searchQuery}" 4K Wallpapers & Art — Search GallaryWala`;
      description = `Explore high-resolution 4K wallpapers and digital art matching "${searchQuery}". Free instant downloads on GallaryWala.`;
      canonicalUrl = `${BASE_URL}/?q=${encodeURIComponent(searchQuery)}`;
      keywords.push(searchQuery.toLowerCase());
    } else if (category && category !== "All") {
      // 3. CATEGORY VIEW SEO
      title = `Best ${category} 4K Wallpapers & HD Backgrounds | GallaryWala`;
      description = `Discover and download trending 4K ${category} wallpapers, AMOLED backgrounds, and aesthetic artwork on GallaryWala.`;
      canonicalUrl = `${BASE_URL}/?category=${encodeURIComponent(category)}`;
      keywords.push(category.toLowerCase(), `${category.toLowerCase()} wallpaper`, `${category.toLowerCase()} 4k`);
    } else {
      // 4. HOMEPAGE SEO
      title = customTitle || "GallaryWala — Visual Discovery, 4K Wallpapers & Digital Art Marketplace";
      description = customDescription || DEFAULT_DESC;
      canonicalUrl = BASE_URL;
    }

    // Apply document title
    document.title = title;

    // Standard Meta Tags
    setMetaTag("name", "title", title);
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords.join(", "));
    setMetaTag("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setCanonical(canonicalUrl);

    // OpenGraph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", pin ? "article" : "website");
    setMetaTag("property", "og:site_name", SITE_NAME);

    // Twitter Card Tags
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);
    setMetaTag("name", "twitter:url", canonicalUrl);
    setMetaTag("name", "twitter:card", "summary_large_image");

  } catch (err) {
    console.warn("SEO update error:", err);
  }
}

/**
 * Intelligent tag enrichment helper for uploading new images
 */
export function enrichTagsWithSEO(title = "", category = "", userTags = []) {
  const resultTags = new Set(
    (Array.isArray(userTags) ? userTags : [userTags])
      .map((t) => String(t || "").trim().toLowerCase().replace(/^#/, ""))
      .filter(Boolean)
  );

  if (category) {
    resultTags.add(category.toLowerCase());
  }

  const text = `${title} ${category}`.toLowerCase();

  // Character & Franchise Mappings
  if (text.includes("naruto") || text.includes("itachi") || text.includes("sasuke") || text.includes("kakashi") || text.includes("madara") || text.includes("obito") || text.includes("minato")) {
    resultTags.add("naruto");
    resultTags.add("naruto shippuden");
    resultTags.add("anime");
    resultTags.add("anime wallpaper");
    resultTags.add("4k wallpaper");
  }

  if (text.includes("itachi")) {
    resultTags.add("itachi");
    resultTags.add("itachi uchiha");
    resultTags.add("uchiha");
    resultTags.add("sharingan");
    resultTags.add("susanoo");
    resultTags.add("akatsuki");
  }

  if (text.includes("sasuke")) {
    resultTags.add("sasuke");
    resultTags.add("sasuke uchiha");
    resultTags.add("uchiha");
    resultTags.add("sharingan");
    resultTags.add("rinnegan");
    resultTags.add("chidori");
  }

  if (text.includes("kakashi")) {
    resultTags.add("kakashi");
    resultTags.add("kakashi hatake");
    resultTags.add("sharingan");
    resultTags.add("chidori");
    resultTags.add("hokage");
    resultTags.add("copy ninja");
  }

  if (text.includes("gojo") || text.includes("satoru") || text.includes("sukuna") || text.includes("toji") || text.includes("jujutsu") || text.includes("jjk") || text.includes("megumi") || text.includes("yuji")) {
    resultTags.add("jujutsu kaisen");
    resultTags.add("jjk");
    resultTags.add("anime");
    resultTags.add("anime wallpaper");
    resultTags.add("4k wallpaper");
  }

  if (text.includes("gojo") || text.includes("satoru")) {
    resultTags.add("gojo");
    resultTags.add("gojo satoru");
    resultTags.add("satoru gojo");
    resultTags.add("hollow purple");
    resultTags.add("unlimited void");
    resultTags.add("six eyes");
    resultTags.add("limitless");
  }

  if (text.includes("toji")) {
    resultTags.add("toji");
    resultTags.add("toji fushiguro");
    resultTags.add("zenin");
    resultTags.add("sorcerer killer");
  }

  if (text.includes("sukuna")) {
    resultTags.add("sukuna");
    resultTags.add("ryomen sukuna");
    resultTags.add("king of curses");
  }

  if (text.includes("levi") || text.includes("eren") || text.includes("mikasa") || text.includes("titan") || text.includes("aot") || text.includes("shingeki")) {
    resultTags.add("attack on titan");
    resultTags.add("aot");
    resultTags.add("shingeki no kyojin");
    resultTags.add("anime");
    resultTags.add("anime wallpaper");
    resultTags.add("4k wallpaper");
  }

  if (text.includes("levi")) {
    resultTags.add("levi");
    resultTags.add("levi ackerman");
    resultTags.add("captain levi");
    resultTags.add("survey corps");
  }

  if (text.includes("eren")) {
    resultTags.add("eren");
    resultTags.add("eren yeager");
    resultTags.add("attack titan");
    resultTags.add("founding titan");
  }

  if (text.includes("loid") || text.includes("anya") || text.includes("yor") || text.includes("forger") || text.includes("spy")) {
    resultTags.add("spy x family");
    resultTags.add("spyxfamily");
    resultTags.add("anime");
    resultTags.add("anime wallpaper");
  }

  if (text.includes("loid") || text.includes("twilight")) {
    resultTags.add("loid");
    resultTags.add("loid forger");
    resultTags.add("twilight");
    resultTags.add("agent twilight");
  }

  if (text.includes("porsche") || text.includes("car") || text.includes("bmw") || text.includes("nissan") || text.includes("gt-r")) {
    resultTags.add("sports cars");
    resultTags.add("classic cars");
    resultTags.add("supercars");
    resultTags.add("automotive");
    resultTags.add("4k wallpaper");
  }

  // Base fallback
  if (resultTags.size === 0) {
    resultTags.add("4k wallpaper");
    resultTags.add("aesthetic");
  }

  return Array.from(resultTags);
}
