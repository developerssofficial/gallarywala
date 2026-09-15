import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";

const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

const UPDATES = [
  {
    id: 1,
    title: "Tokyo Nights - Cyberpunk Neon City Rain 4K Wallpaper",
    description: "Atmospheric Tokyo night street photography with vibrant neon lights, reflections in the rain, and futuristic cyberpunk aesthetic in ultra HD 4K resolution.",
    category: "Tokyo Nights",
    tags: ["tokyo nights", "cyberpunk", "neon", "rainy days", "4k wallpaper", "cityscape", "shinjuku", "japan aesthetic", "amoled", "dark mode", "street photography", "desktop wallpaper"]
  },
  {
    id: 2,
    title: "Modern Architectural Marvel - Futuristic Structure 4K",
    description: "Ultra high-definition architectural wallpaper featuring clean lines, modern geometric patterns, minimalist glass facade, and golden hour reflections.",
    category: "Architecture",
    tags: ["architecture", "minimalist", "geometric", "4k wallpaper", "modern design", "urban", "aesthetic", "desktop wallpaper", "8k uhd"]
  },
  {
    id: 3,
    title: "Dreamy Aesthetic Landscape - Soft Pastel Sunset 4K",
    description: "Ethereal pastel sky and sunset landscape wallpaper with soft golden clouds and peaceful aesthetic visual atmosphere.",
    category: "Aesthetic",
    tags: ["aesthetic", "sunset", "golden hour", "minimalist", "lo-fi", "pastel", "clouds", "cozy vibes", "4k wallpaper", "peaceful", "sky"]
  },
  {
    id: 4,
    title: "Cosmic Galaxy & Deep Nebula - Outer Space 4K Wallpaper",
    description: "Spectacular deep space nebula wallpaper featuring sparkling star clusters, interstellar dust, and vibrant purple cosmic galaxy in 4K UHD.",
    category: "Galaxy",
    tags: ["galaxy", "space", "astronomy", "nebula", "stars", "cosmos", "universe", "4k wallpaper", "amoled wallpapers", "dark mode", "deep space", "sci-fi"]
  },
  {
    id: 5,
    title: "Cozy Rainy Day Coffee - Warm Cafe Aesthetic 4K",
    description: "Warm artisan latte and fresh coffee beans on a wooden table next to a rain-streaked window with cozy cafe vibes.",
    category: "Coffee",
    tags: ["coffee", "cafe", "cozy vibes", "rainy days", "aesthetic", "daily life", "latte art", "food", "warm", "relaxing", "4k wallpaper"]
  },
  {
    id: 6,
    title: "Vintage Porsche Classic Sports Car - Foggy Forest Road 4K",
    description: "Iconic vintage sports car parked on an asphalt mountain road surrounded by mist and autumn trees in ultra high-definition 4K.",
    category: "Classic Cars",
    tags: ["classic cars", "porsche", "sports cars", "automotive", "supercars", "jdm cars", "4k wallpaper", "foggy", "forest", "dark aesthetic", "car photography", "desktop background"]
  },
  {
    id: 7,
    title: "Gojo Satoru - Sunset Shrine Balcony (Jujutsu Kaisen 4K)",
    description: "Stylish 4K anime wallpaper of Gojo Satoru in dark modern suit with sunglasses sitting on a traditional Japanese pagoda shrine balcony during golden hour sunset.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "jujutsu kaisen", "jjk", "anime", "anime wallpaper", "4k wallpaper", "sunglasses", "jujutsu high", "sorcerer", "golden hour", "japan", "manga", "phone wallpaper"]
  },
  {
    id: 8,
    title: "Hollow Purple Gojo Satoru - Limitless Curse Energy 4K",
    description: "Electrifying 4K wallpaper of Satoru Gojo channeling Hollow Purple (Kyoshiki Murasaki) with intense cursed energy aura and glowing blue limitless eyes.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "hollow purple", "murasaki", "limitless", "six eyes", "jujutsu kaisen", "jjk", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "sukuna", "manga art"]
  },
  {
    id: 9,
    title: "Gojo Satoru - Tokyo Night Rain & Blindfold 4K",
    description: "Moody dark anime wallpaper of Gojo Satoru wearing his black Jujutsu High uniform and blindfold, standing in illuminated rain on a Tokyo city street.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "blindfold", "jujutsu kaisen", "jjk", "tokyo nights", "rainy days", "cyberpunk", "anime", "anime wallpaper", "4k wallpaper", "dark mode", "amoled wallpapers", "manga"]
  },
  {
    id: 10,
    title: "Gojo Satoru - Six Eyes Limitless Sorcerer Portrait 4K",
    description: "Ultra realistic anime portrait of Gojo Satoru with white spiky hair, silver earrings, chain necklace, and iconic black blindfold in high fashion aesthetic.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "portrait", "six eyes", "jujutsu kaisen", "jjk", "anime", "anime boy", "aesthetic", "4k wallpaper", "monochrome", "dark aesthetic", "phone wallpaper", "profile picture"]
  },
  {
    id: 11,
    title: "Gojo Satoru - Unlimited Void Domain Expansion (4K UHD)",
    description: "Breathtaking 4K wallpaper of Gojo Satoru casting Unlimited Void (Muryokusho) domain expansion across the celestial moon and cosmos with glowing blue cursed energy.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "unlimited void", "domain expansion", "muryokusho", "jujutsu kaisen", "jjk", "galaxy", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "celestial", "special grade sorcerer"]
  },
  {
    id: 12,
    title: "Gojo Satoru - Cyberpunk Shibuya Neon Walk 4K",
    description: "Full body anime wallpaper of Gojo Satoru walking through vibrant purple and cyan neon-lit Shibuya streets under the rain in a futuristic techwear outfit.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "shibuya", "cyberpunk", "neon", "tokyo nights", "jujutsu kaisen", "jjk", "anime", "anime wallpaper", "4k wallpaper", "amoled", "streetwear", "techwear"]
  },
  {
    id: 13,
    title: "Gojo Satoru - Dark Manga Ink & Sumi-e Art 4K",
    description: "Intense black and white manga illustration of Gojo Satoru with dynamic ink splatter, piercing gaze under blindfold, and traditional Japanese sumi-e aesthetic.",
    category: "Anime",
    tags: ["gojo", "gojo satoru", "satoru gojo", "manga", "ink art", "monochrome", "sumi-e", "black and white", "dark anime", "jujutsu kaisen", "jjk", "anime", "4k wallpaper", "amoled", "sketch"]
  },
  {
    id: 14,
    title: "Levi Ackerman - Cyberpunk Rain Alleyway 4K (AOT)",
    description: "Dark cinematic 4K wallpaper of Captain Levi Ackerman in a long black leather trench coat walking down a neon-lit Tokyo cyberpunk alley in the rain.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "captain levi", "attack on titan", "aot", "shingeki no kyojin", "cyberpunk", "neon", "rainy days", "anime", "anime wallpaper", "4k wallpaper", "dark mode", "eren", "mikasa"]
  },
  {
    id: 15,
    title: "Levi Ackerman - Humanity's Strongest Soldier 4K",
    description: "High resolution 4K wallpaper of Captain Levi Ackerman from Attack on Titan with his sharp gaze, Survey Corps cravat, and dark aesthetic style.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "captain levi", "scout regiment", "survey corps", "humanity strongest", "attack on titan", "aot", "shingeki no kyojin", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "eren yeager"]
  },
  {
    id: 16,
    title: "Itachi Uchiha - Akatsuki Cloak & Crimson Night 4K",
    description: "Stunning 4K wallpaper of Itachi Uchiha wearing the Akatsuki cloud cloak under a full blood moon with glowing red Sharingan eyes and crows flying.",
    category: "Anime",
    tags: ["itachi", "itachi uchiha", "uchiha", "naruto", "naruto shippuden", "akatsuki", "sharingan", "mangekyou sharingan", "blood moon", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "sasuke", "dark anime"]
  },
  {
    id: 17,
    title: "Itachi Uchiha - Tsukuyomi Illusion & Crow Genjutsu 4K",
    description: "Epic Naruto Shippuden wallpaper featuring Itachi Uchiha casting Tsukuyomi with swirling black crows, crimson feathers, and Mangekyou Sharingan ocular power.",
    category: "Anime",
    tags: ["itachi", "itachi uchiha", "tsukuyomi", "genjutsu", "sharingan", "mangekyou", "naruto", "naruto shippuden", "uchiha clan", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "amoled", "sasuke uchiha"]
  },
  {
    id: 18,
    title: "Itachi Uchiha - Red Susanoo Armor Awakening 4K",
    description: "Spectacular 4K wallpaper of Itachi Uchiha standing before his colossal Red Susanoo warrior surrounded by floating apocalyptic debris and crimson fire clouds.",
    category: "Anime",
    tags: ["itachi", "itachi uchiha", "susanoo", "red susanoo", "totsuka blade", "naruto", "naruto shippuden", "uchiha", "sharingan", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "dark anime", "sasuke", "kakashi"]
  },
  {
    id: 19,
    title: "Itachi Uchiha - Colossal Susanoo Overlord 4K Wallpaper",
    description: "Ultra HD 4K anime wallpaper of Itachi Uchiha in Akatsuki robe backed by the gigantic fiery red Susanoo titan avatar looming over a ruined dark battlefield.",
    category: "Anime",
    tags: ["itachi", "itachi uchiha", "susanoo", "akatsuki", "naruto", "naruto shippuden", "uchiha clan", "mangekyou sharingan", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "naruto wallpaper", "sasuke"]
  },
  {
    id: 20,
    title: "Kakashi Hatake - Lightning Blade Chidori Awakening 4K",
    description: "Electrifying 4K wallpaper of Kakashi Hatake the Copy Ninja channeling blue Lightning Blade (Raikiri / Chidori) with flashing red Sharingan in the dark.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "chidori", "raikiri", "lightning blade", "sharingan", "copy ninja", "naruto", "naruto shippuden", "hokage", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "itachi"]
  },
  {
    id: 21,
    title: "Kakashi Hatake - 6th Hokage Cloak & Anbu Black Ops 4K",
    description: "Dynamic wallpaper of Kakashi Hatake featuring Anbu mask and Hokage vest with vivid lightning sparks and deep shadow aesthetics in 4K resolution.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "anbu", "hokage", "sixth hokage", "naruto", "naruto shippuden", "sharingan", "kamui", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "team 7", "sasuke"]
  },
  {
    id: 22,
    title: "Kakashi Hatake - Mangekyou Sharingan Kamui Dimension 4K",
    description: "Intense 4K anime wallpaper of Kakashi Hatake activating Kamui space-time ninjutsu with swirling void vortex and glowing red eye.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "kamui", "mangekyou sharingan", "sharingan", "naruto", "naruto shippuden", "obito", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "ninja"]
  },
  {
    id: 23,
    title: "Kakashi Hatake - Dark Cyberpunk Shinobi 4K Wallpaper",
    description: "Modern cyberpunk re-imagination of Kakashi Hatake with glowing cyber-eye, neon blue lightning wires, and high-tech tactical shinobi armor.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "cyberpunk", "neon", "shinobi", "naruto", "naruto shippuden", "sharingan", "lightning", "anime", "anime wallpaper", "4k wallpaper", "amoled", "sci-fi"]
  },
  {
    id: 24,
    title: "Kakashi Hatake - White Fang Legacy & Silver Hair 4K",
    description: "Cinematic 4K portrait of Kakashi Hatake standing in heavy rain with face mask, spiky silver hair, and piercing Sharingan glow.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "white fang", "rainy days", "naruto", "naruto shippuden", "sharingan", "copy ninja", "anime", "anime wallpaper", "4k wallpaper", "portrait", "dark aesthetic"]
  },
  {
    id: 25,
    title: "Kakashi Hatake - Team 7 Sensei & Purple Lightning 4K",
    description: "Stunning 4K artwork of Kakashi Hatake unleashing Shiden (Purple Lightning) with master ninja aura and fierce combat stance.",
    category: "Anime",
    tags: ["kakashi", "kakashi hatake", "purple lightning", "shiden", "team 7", "sensei", "naruto", "naruto shippuden", "boruto", "anime", "anime wallpaper", "4k wallpaper", "amoled", "ninja"]
  },
  {
    id: 26,
    title: "Sasuke Uchiha - Curse Mark Stage 2 & Chidori 4K",
    description: "Dark Naruto Shippuden 4K wallpaper of Sasuke Uchiha unleashing black Chidori with demonic Curse Mark wings and glowing Sharingan.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "curse mark", "chidori", "black chidori", "sharingan", "uchiha", "naruto", "naruto shippuden", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "itachi"]
  },
  {
    id: 27,
    title: "Sasuke Uchiha - Eternal Mangekyou Sharingan & Rinnegan 4K",
    description: "Epic 4K wallpaper of Sasuke Uchiha wielding both the Eternal Mangekyou Sharingan and Six Tomoe Rinnegan with purple lightning blade.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "rinnegan", "eternal mangekyou", "sharingan", "kusanagi", "naruto", "naruto shippuden", "uchiha clan", "anime", "anime wallpaper", "4k wallpaper", "amoled", "itachi"]
  },
  {
    id: 28,
    title: "Sasuke Uchiha - Purple Susanoo Ribcage & Arrow 4K",
    description: "Colossal Purple Susanoo warrior avatar summoned by Sasuke Uchiha in 4K resolution with flaming chakra arrows and dark celestial glow.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "susanoo", "purple susanoo", "indras arrow", "naruto", "naruto shippuden", "uchiha", "mangekyou", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "dark anime"]
  },
  {
    id: 29,
    title: "Sasuke Uchiha - Lone Avenger in the Rain 4K",
    description: "Moody dark aesthetic wallpaper of Sasuke Uchiha walking alone under a stormy sky with his Kusanagi sword drawn and red Sharingan active.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "avenger", "kusanagi sword", "rainy days", "naruto", "naruto shippuden", "uchiha", "anime", "anime wallpaper", "4k wallpaper", "dark mode", "amoled", "naruto vs sasuke"]
  },
  {
    id: 30,
    title: "Sasuke Uchiha - Kirin Thunder Dragon Attack 4K",
    description: "Spectacular anime wallpaper of Sasuke Uchiha summoning Kirin the legendary lightning beast from thunder clouds with supreme precision.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "kirin", "lightning", "thunder dragon", "naruto", "naruto shippuden", "chidori", "uchiha", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime"]
  },
  {
    id: 31,
    title: "Sasuke Uchiha - Final Valley Indra Chakra 4K",
    description: "High-resolution 4K wallpaper of Sasuke Uchiha preparing for the ultimate battle with glowing purple chakra aura and decisive shinobi resolve.",
    category: "Anime",
    tags: ["sasuke", "sasuke uchiha", "final valley", "indra reincarnation", "naruto", "naruto shippuden", "rinnegan", "sharingan", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "naruto uzumaki"]
  },
  {
    id: 32,
    title: "Eren Yeager - Attack Titan Rumbling Roar 4K (AOT)",
    description: "Terrifying and magnificent 4K wallpaper of Eren Yeager with glowing emerald green eyes, Founding Titan power, and freedom fighter determination.",
    category: "Anime",
    tags: ["eren", "eren yeager", "attack titan", "founding titan", "rumbling", "attack on titan", "aot", "shingeki no kyojin", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "levi ackerman", "mikasa"]
  },
  {
    id: 33,
    title: "Eren Yeager - Paths Dimension & Coordinate Tree 4K",
    description: "Ethereal 4K wallpaper of Eren Yeager in the endless cosmic Paths dimension standing before the glowing blue Coordinate Tree.",
    category: "Anime",
    tags: ["eren", "eren yeager", "paths", "coordinate", "founding titan", "attack on titan", "aot", "shingeki no kyojin", "galaxy", "anime", "anime wallpaper", "4k wallpaper", "amoled wallpapers", "freedom"]
  },
  {
    id: 34,
    title: "Toji Fushiguro - Sorcerer Killer Heavenly Restriction 4K",
    description: "Intense 4K wallpaper of Toji Fushiguro (Zenin) wielding the Inverted Spear of Heaven with raw physical prowess and deadly assassin smirk.",
    category: "Anime",
    tags: ["toji", "toji fushiguro", "zenin", "sorcerer killer", "heavenly restriction", "inverted spear of heaven", "jujutsu kaisen", "jjk", "gojo satoru", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "megumi"]
  },
  {
    id: 35,
    title: "Toji Fushiguro - Hidden Inventory Blood & Steel 4K",
    description: "Action-packed 4K anime wallpaper of Toji Fushiguro in his iconic black tight shirt and tactical arsenal ready to breach Jujutsu barriers.",
    category: "Anime",
    tags: ["toji", "toji fushiguro", "hidden inventory", "jujutsu kaisen", "jjk", "assassin", "anime", "anime wallpaper", "4k wallpaper", "dark mode", "amoled", "gojo", "manga art"]
  },
  {
    id: 36,
    title: "Toji Fushiguro - Playful Cloud Cursed Weapon 4K",
    description: "Dynamic 4K wallpaper of Toji Fushiguro unleashing pure physical kinetic force with three-section staff Playful Cloud in Tokyo ruins.",
    category: "Anime",
    tags: ["toji", "toji fushiguro", "playful cloud", "cursed tool", "jujutsu kaisen", "jjk", "shibuya incident", "anime", "anime wallpaper", "4k wallpaper", "amoled", "dark anime", "zenin clan"]
  },
  {
    id: 37,
    title: "Loid Forger - Agent Twilight Secret Mission (Spy x Family 4K)",
    description: "Sleek 4K anime wallpaper of Loid Forger (Agent Twilight) in a tailored green suit holding a silenced pistol in a classic noir espionage setting.",
    category: "Anime",
    tags: ["loid", "loid forger", "twilight", "agent twilight", "spy x family", "spyxfamily", "anya forger", "yor forger", "anime", "anime wallpaper", "4k wallpaper", "secret agent", "espionage", "aesthetic"]
  },
  {
    id: 38,
    title: "Loid Forger - Operation Strix Master Spy 4K",
    description: "Sophisticated 4K wallpaper of Loid Forger calculating his next move with sharp intelligence, sleek trench coat, and vintage city backdrop.",
    category: "Anime",
    tags: ["loid", "loid forger", "twilight", "operation strix", "spy x family", "spyxfamily", "anime", "anime wallpaper", "4k wallpaper", "gentleman", "noir", "anya", "yor"]
  },
  {
    id: 39,
    title: "Loid Forger - Berlint Night Espionage 4K Wallpaper",
    description: "Atmospheric night wallpaper of Loid Forger standing on a rainy European rooftop overlooking the city lights in high-definition 4K.",
    category: "Anime",
    tags: ["loid", "loid forger", "twilight", "spy x family", "spyxfamily", "rainy days", "night life", "anime", "anime wallpaper", "4k wallpaper", "dark aesthetic", "amoled", "anya forger"]
  },
  {
    id: 40,
    title: "Loid Forger - Family Protector & Elite Assassin 4K",
    description: "Charismatic 4K wallpaper of Loid Forger with confident smile, stylish fedora, and warm golden lighting balancing secret spy duty with fatherhood.",
    category: "Anime",
    tags: ["loid", "loid forger", "twilight", "spy x family", "spyxfamily", "anya", "yor forger", "anime", "anime wallpaper", "4k wallpaper", "aesthetic", "phone wallpaper", "desktop wallpaper"]
  }
];

async function updateAll() {
  console.log(`Starting SEO update for ${UPDATES.length} images in Supabase...`);
  let updatedCount = 0;
  for (const item of UPDATES) {
    const { error } = await supabase
      .from("images")
      .update({
        title: item.title,
        description: item.description,
        category: item.category,
        tags: item.tags
      })
      .eq("id", item.id);

    if (error) {
      console.error(`Failed to update ID ${item.id}:`, error);
    } else {
      updatedCount++;
      console.log(`✓ Updated ID ${item.id}: "${item.title}" [${item.tags.length} tags]`);
    }
  }
  console.log(`\n🎉 Successfully updated ${updatedCount}/${UPDATES.length} images in Supabase!`);
}

updateAll();
