/**
 * GallaryWala Store Products Catalog
 * Exclusively for Products & Merch (Digital Bundles, Apparel, Canvas Prints, Creator Kits)
 */

export const INITIAL_STORE_PRODUCTS = [
  {
    id: "prod_anime_oversized_tee_01",
    title: "Gojo Satoru 'Infinite Void' Oversized Vintage Heavyweight Tee",
    description: "Premium 240 GSM 100% combed cotton streetwear t-shirt featuring high-density discharge anime graphic print with ribbed collar and drop-shoulder boxy fit.",
    price: 24.99,
    originalPrice: 39.99,
    discountPercent: 38,
    badge: "🔥 BESTSELLER",
    category: "Streetwear Apparel",
    productType: "physical",
    itemCount: "Physical Apparel",
    specs: {
      material: "240 GSM 100% Combed Cotton",
      fit: "Oversized Streetwear Boxy Fit",
      print: "High-Density Screen Discharge",
      shipping: "Worldwide Insured Delivery (3-7 Days)"
    },
    sizes: ["S", "M", "L", "XL", "2XL"],
    rating: 4.9,
    reviewsCount: 214,
    salesCount: 680,
    coverImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85",
    previewImages: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=85",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=85"
    ],
    features: [
      "Heavyweight 240 GSM Luxury Organic Cotton",
      "Pre-shrunk fabric to prevent washing shrinkage",
      "Vibrant fade-resistant anime graphic artwork",
      "Comes with Official GallaryWala Authenticity Tag",
      "30-Day Free Return & Exchange Guarantee"
    ],
    author: {
      name: "GallaryWala Official",
      username: "@gallarywala",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gallarywala",
      isVerified: true
    }
  },
  {
    id: "prod_cyberpunk_canvas_02",
    title: "Neo-Tokyo Cyberpunk Rain — Gallery Framed Metal/Canvas Wall Art",
    description: "Museum-grade stretched canvas and brushed aluminum metal print featuring vibrant glowing neon cyberpunk cityscapes with anti-glare UV matte finish.",
    price: 34.99,
    originalPrice: 59.99,
    discountPercent: 42,
    badge: "⚡ SIGNATURE ART",
    category: "Posters & Canvas Art",
    productType: "physical",
    itemCount: "Framed Wall Art",
    specs: {
      material: "380 GSM Artist Cotton Canvas / Aluminum",
      frame: "Solid Matte Black Floating Oak Frame",
      finish: "Anti-UV Scratch-Proof Matte Shield",
      shipping: "Rigid Reinforced Wood Box Delivery"
    },
    sizes: ["12x18 inch", "18x24 inch", "24x36 inch (Large)", "30x40 inch (Gallery)"],
    rating: 5.0,
    reviewsCount: 142,
    salesCount: 420,
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=85",
    previewImages: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=85",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=85",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=85"
    ],
    features: [
      "Ready to hang with pre-installed stainless wire mount",
      "Ultra-vivid 12-Color archival pigment giclée printing",
      "Hand-stretched by master artisans over kiln-dried wood",
      "Certificate of Authenticity hand-signed by creator"
    ],
    author: {
      name: "NeoArtist Studio",
      username: "@neoartist",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=neoartist",
      isVerified: true
    }
  },
  {
    id: "prod_desk_mat_extended_03",
    title: "Katana Blood Moon XXL RGB Gaming Desk Mat (900x400mm)",
    description: "Pro-grade micro-woven speed cloth desk mat with stitched anti-fray edges, non-slip natural rubber base, and spill-resistant coating.",
    price: 18.99,
    originalPrice: 29.99,
    discountPercent: 37,
    badge: "🎮 GAMING GEAR",
    category: "Gaming & Desk Accessories",
    productType: "physical",
    itemCount: "XXL Desk Pad",
    specs: {
      dimensions: "900 x 400 x 4mm (Extended XXL)",
      surface: "Ultra-Smooth High-Density Microfiber",
      base: "Textured Anti-Slip Eco Rubber Base",
      features: "Waterproof Spill Protection"
    },
    sizes: ["Extended (900x400mm)", "Giant (1200x600mm)"],
    rating: 4.8,
    reviewsCount: 95,
    salesCount: 310,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=85",
    previewImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=85",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&q=85"
    ],
    features: [
      "Precision-tuned for low and high DPI mouse sensors",
      "Precision 360° lock-stitched anti-peeling borders",
      "Waterproof nanocoating makes liquid spills bead right off",
      "Machine washable on cold gentle cycle"
    ],
    author: {
      name: "DarkPixel Creator",
      username: "@darkpixel",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=darkpixel",
      isVerified: true
    }
  },
  {
    id: "prod_lightroom_master_kit_04",
    title: "Cinematic & Neon Master Lightroom Preset Suite (45 Presets + LUTs)",
    description: "The complete color grading suite with 45 professional .XMP, .DNG presets and 15 .CUBE video LUTs for Lightroom, Photoshop, Premiere Pro, and DaVinci Resolve.",
    price: 9.99,
    originalPrice: 29.99,
    discountPercent: 67,
    badge: "🎨 CREATOR KIT",
    category: "Digital Tools & Presets",
    productType: "digital",
    itemCount: "45 Presets + 15 LUTs",
    specs: {
      compatibility: "Lightroom Mobile/Desktop, Photoshop, Premiere",
      format: ".XMP, .DNG, .CUBE, PDF Manual",
      delivery: "Instant High-Speed Cloud ZIP Download",
      license: "Commercial Unlimited Project License"
    },
    sizes: ["Full Digital Suite (.ZIP Archive)"],
    rating: 4.9,
    reviewsCount: 168,
    salesCount: 520,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=85",
    previewImages: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=85",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=85"
    ],
    features: [
      "45 One-Click Master Presets for Portrait, Anime & Night Scapes",
      "15 Video Cinema LUTs for Filmmaking and Reels",
      "Step-by-step Installation PDF & Video Tutorial Guide",
      "Lifetime updates and free future preset expansion packs"
    ],
    author: {
      name: "Veylorae Studio",
      username: "@veylorae",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=veylorae",
      isVerified: true
    }
  },
  {
    id: "prod_acrylic_standee_05",
    title: "Levi Ackerman Dual-Blade Holographic Acrylic Standee (18cm)",
    description: "Laser-cut double-sided laser etched acrylic figure with holographic sparkle finish, custom engraved character base, and collector's packaging.",
    price: 14.99,
    originalPrice: 22.99,
    discountPercent: 35,
    badge: "✨ COLLECTIBLE",
    category: "Collectibles & Figures",
    productType: "physical",
    itemCount: "Acrylic Collector Stand",
    specs: {
      height: "18 cm (7.1 Inches)",
      material: "4mm High-Definition Premium Cast Acrylic",
      finish: "Double-Sided Holographic Rainbow Shimmer",
      packaging: "Collector's Gift Box with Protective Film"
    },
    sizes: ["18cm Deluxe Edition"],
    rating: 4.9,
    reviewsCount: 78,
    salesCount: 290,
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&q=85",
    previewImages: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&q=85",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=85"
    ],
    features: [
      "High-definition UV printing sealed inside dual acrylic layers",
      "Scratch-resistant and crystal-clear transparency",
      "Includes engraved nameplate stand and collector card",
      "Carefully packaged with shockproof foam casing"
    ],
    author: {
      name: "GallaryWala Official",
      username: "@gallarywala",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gallarywala",
      isVerified: true
    }
  }
];
