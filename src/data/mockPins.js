export const INITIAL_PINS = [
  {
    id: "img-girl-night-1",
    title: "A night",
    description: "Cinematic portrait in evening rain with glowing lanterns and city lights reflecting on the wet street.",
    imageUrl: "/gallery/girl_rain.png",
    aspectRatio: "2/3",
    category: "Street Photography",
    tags: ["street photography", "tokyo nights", "rainy days", "aesthetic", "daily life", "dark mode"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 1240,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app",
    comments: []
  },
  {
    id: "img-porsche-1",
    title: "Let's have some tour",
    description: "Vintage black Porsche 911 resting on wet asphalt surrounded by autumn mountain peaks and mist.",
    imageUrl: "/gallery/porsche.png",
    aspectRatio: "16/10",
    category: "Supercars",
    tags: ["supercars", "sports cars", "classic cars", "automotive", "4k wallpapers", "autumn vibes"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 2150,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app",
    comments: []
  },
  {
    id: "img-cabin-1",
    title: "Nature & Landscapes",
    description: "Warm architectural glass cabin glowing warmly amidst tranquil misty pine trees at dusk.",
    imageUrl: "/gallery/cabin.png",
    aspectRatio: "4/5",
    category: "Nature",
    tags: ["nature", "architecture", "interior design", "cozy vibes", "forest", "4k wallpapers"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 1490,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app",
    comments: []
  },
  {
    id: "img-galaxy-1",
    title: "Where the night meets nature",
    description: "Crystal clear mirror reflection of the starry night sky and Milky Way galaxy over calm waters.",
    imageUrl: "/gallery/galaxy.png",
    aspectRatio: "16/9",
    category: "Galaxy",
    tags: ["galaxy", "space", "astronomy", "amoled wallpapers", "dark mode", "8k uhd", "night life"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 3120,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app",
    comments: []
  },
  {
    id: "img-1789259161062",
    title: "Street Photography",
    description: "Atmospheric rainy night in Tokyo with glowing neon signboards reflecting on wet asphalt as a lone person walks by.",
    imageUrl: "/gallery/tokyo_street.png",
    aspectRatio: "9/16",
    category: "Street Photography",
    tags: ["street photography", "tokyo nights", "rainy days", "night rain", "neon", "tokyo", "cityscape"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 1840,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app/?pin=img-1789259161062",
    comments: [
      { id: "c-tokyo-1", user: "NeonVibes", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonVibes", text: "Insane reflection and color palette! 🔥", time: "2 hours ago" }
    ]
  },
  {
    id: "img-coffee-1",
    title: "Rainy Day Comfort",
    description: "Steaming handcrafted latte with delicate latte art sitting by a rain-splattered cafe window.",
    imageUrl: "/gallery/coffee.png",
    aspectRatio: "4/5",
    category: "Coffee",
    tags: ["coffee", "food", "daily life", "cozy vibes", "rainy days", "aesthetic"],
    author: {
      name: "xparrowdev",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=xparrowdev",
      username: "@xparrowdev"
    },
    uploaderId: "xparrowdev@gmail.com",
    likes: 1890,
    createdAt: "2026-09-12",
    link: "https://gallarywala.vercel.app",
    comments: []
  }
];

export const CATEGORIES = [
  "All",
  // 1. Core Visuals & Wallpapers
  "4K Wallpapers",
  "AMOLED Wallpapers",
  "8K UHD",
  "Aesthetic",
  "Minimalist",
  "Dark Mode",
  "Monochrome",
  "Neon",
  "Retro",
  "Synthwave",
  "Vaporwave",
  "Cinematic",
  
  // 2. Anime & Digital Art
  "Anime",
  "Manga",
  "Studio Ghibli",
  "Lo-Fi",
  "Cyberpunk",
  "Sci-Fi",
  "AI Art",
  "Digital Art",
  "Illustrations",
  "3D Renders",
  "Abstract Art",
  "Fluid Art",
  "Pixel Art",
  "Vector Art",
  "Concept Art",
  "Fantasy",
  "Mythical",

  // 3. Cars & Automotive
  "Supercars",
  "Sports Cars",
  "Classic Cars",
  "Muscle Cars",
  "JDM Cars",
  "Hypercars",
  "Automotive",
  "Motorcycles",

  // 4. Gaming & Tech
  "Gaming",
  "Esports",
  "Game Setup",
  "Desk Setup",
  "Workstation",

  // 5. Daily Life & Lifestyle Vibes
  "Daily Life",
  "Cozy Vibes",
  "Rainy Days",
  "Golden Hour",
  "Sunsets",
  "Night Life",
  "Tokyo Nights",
  "Books & Reading",
  "Self Care",
  "Meditation & Peace",

  // 6. Food & Beverages
  "Food",
  "Coffee",
  "Desserts",
  "Bakery",
  "Pizza",
  "Burgers",
  "Sushi",
  "Street Food",
  "Drinks",
  "Cocktails",
  "Fruits",
  "Culinary Art",

  // 7. Nature, Travel & World
  "Nature",
  "Landscapes",
  "Mountains",
  "Ocean",
  "Beaches",
  "Forest",
  "Waterfalls",
  "Deserts",
  "Snow & Winter",
  "Autumn Vibes",
  "Flowers",
  "Animals",
  "Wildlife",
  "Space",
  "Astronomy",
  "Galaxy",
  "Travel",
  "Architecture",
  "Interior Design",
  "Street Photography",
  "Urban",
  "Cityscape",
  "Macro Photography",

  // 8. Fashion & Culture
  "Fashion",
  "Streetwear",
  "Sneakers",
  "Luxury Living",
  "Vintage & Nostalgia",
  "Typography",
  "Quotes"
];

export const INITIAL_BOARDS = [
  {
    id: "board-1",
    name: "Tokyo Nights & Neon",
    description: "Cyberpunk streets, rainy night aesthetics and neon visuals",
    pinIds: ["img-1789259161062", "pin-1"],
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-01"
  },
  {
    id: "board-2",
    name: "4K Aesthetic Wallpapers",
    description: "Ultra high definition wallpapers for desktop and mobile",
    pinIds: ["pin-3", "pin-4", "pin-5"],
    coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-02"
  },
  {
    id: "board-3",
    name: "Minimalist Spaces",
    description: "Clean architecture, coffee nooks and workspace setups",
    pinIds: ["pin-2", "pin-6", "pin-8"],
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80",
    createdAt: "2026-09-03"
  }
];
