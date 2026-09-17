import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://pqgltzdrnzhvatxgscif.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2x0emRybnpodmF0eGdzY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwODgxNDQsImV4cCI6MjEwNDY2NDE0NH0.mOdHXOniBzvOixUzrIuCvLXEPMg-O--pETRAMRw7VzU";
const supabase = createClient(DEFAULT_URL, DEFAULT_KEY);

const CLOUD_NAME = "nho4ptej";
const UPLOAD_PRESET = "gallarywala_preset";
const SOURCE_DIR = "C:\\Users\\user\\Downloads\\ChatGPT_AI_Images";

const AUTHOR = {
  name: "GallaryWala Official",
  username: "@gallarywala",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gallarywala"
};

const METADATA_MAP = {
  "Chrollo_Lucilfer_standing_at_t_1789455019359.png": {
    title: "Chrollo Lucilfer - Yorknew City Overlook & St. Peter Cross 4K (Hunter x Hunter)",
    description: "Phantom Troupe leader Chrollo Lucilfer standing atop a Yorknew skyscraper in iconic fur-collared trench coat with glowing purple aura in 4K resolution.",
    category: "Anime",
    tags: ["chrollo", "chrollo lucilfer", "phantom troupe", "genei ryodan", "hunter x hunter", "hxh", "skill hunter", "hisoka", "yorknew city", "anime", "anime wallpaper", "4k wallpaper", "dark anime", "amoled"]
  },
  "Chrollo_Lucilfer_standing_besi_1789454964299.png": {
    title: "Chrollo Lucilfer - St. Peter Gothic Cathedral Ruins 4K (Hunter x Hunter)",
    description: "Moody aesthetic wallpaper of Chrollo Lucilfer standing beside ancient cathedral stone pillars with forehead cross tattoo and piercing grey eyes.",
    category: "Anime",
    tags: ["chrollo", "chrollo lucilfer", "phantom troupe", "spider", "hunter x hunter", "hxh", "gothic anime", "anime wallpaper", "4k wallpaper", "dark aesthetic", "manga"]
  },
  "Chrollo_Lucilfer_standing_in_a_1789454812048.jpg": {
    title: "Chrollo Lucilfer - Bandit's Secret Skill Hunter Grimoire 4K",
    description: "Chrollo Lucilfer preparing to open the Bandit's Secret book with crimson neon shadows and mysterious phantom aura.",
    category: "Anime",
    tags: ["chrollo", "chrollo lucilfer", "bandits secret", "nen", "phantom troupe", "hunter x hunter", "hxh", "anime", "anime wallpaper", "4k wallpaper", "dark mode"]
  },
  "Chrollo_Lucilfer_standing_in_t_1789455056302.png": {
    title: "Chrollo Lucilfer - Yorknew Midnight Requiem Symphony 4K",
    description: "Dramatic 4K visual of Chrollo conducting the Yorknew City mafia destruction requiem amidst rising flames and moonlight.",
    category: "Anime",
    tags: ["chrollo", "chrollo lucilfer", "yorknew", "requiem", "phantom troupe", "hunter x hunter", "hxh", "anime wallpaper", "4k wallpaper", "cinematic"]
  },
  "Dazai_Osamu_from_Bungou_Stray__1789454530738.png": {
    title: "Dazai Osamu - Armed Detective Agency Trench Coat 4K (Bungou Stray Dogs)",
    description: "Iconic 4K anime wallpaper of Dazai Osamu with sand-colored trench coat, bandages, and enigmatic smile overlooking Yokohama port.",
    category: "Anime",
    tags: ["dazai", "dazai osamu", "bungou stray dogs", "bsd", "no longer human", "armed detective agency", "chuuya", "akutagawa", "atsushi", "anime", "anime wallpaper", "4k wallpaper", "aesthetic"]
  },
  "Dazai_Osamu_leaning_against_a__1789454749537.png": {
    title: "Dazai Osamu - Yokohama Streetlight Noir Aesthetic 4K (Bungou Stray Dogs)",
    description: "Melancholic and stylish 4K portrait of Dazai Osamu leaning against an antique Yokohama streetlight in evening fog.",
    category: "Anime",
    tags: ["dazai", "dazai osamu", "bungou stray dogs", "bsd", "yokohama", "noir anime", "vintage anime", "anime wallpaper", "4k wallpaper", "cozy vibes", "night life"]
  },
  "Dazai_Osamu_standing_beside_a__1789454567809.png": {
    title: "Dazai Osamu - Sunset Riverbank Contemplation 4K (Bungou Stray Dogs)",
    description: "Peaceful golden hour wallpaper of Dazai Osamu standing beside the tranquil Tsurumi riverbank with gentle autumn breeze.",
    category: "Anime",
    tags: ["dazai", "dazai osamu", "bungou stray dogs", "bsd", "golden hour", "sunsets", "riverbank", "aesthetic anime", "anime wallpaper", "4k wallpaper", "lo-fi"]
  },
  "Dazai_Osamu_walking_slowly_tow_1789454785445.png": {
    title: "Dazai Osamu - Misty Yokohama Pier Stroll 4K (Bungou Stray Dogs)",
    description: "Atmospheric 4K wallpaper of Dazai Osamu walking through twilight mist with drifting sakura leaves and maritime lights.",
    category: "Anime",
    tags: ["dazai", "dazai osamu", "bungou stray dogs", "bsd", "port mafia", "yokohama pier", "anime wallpaper", "4k wallpaper", "aesthetic", "desktop wallpaper"]
  },
  "close_up_portrait_of_Dazai_Osa_1789454836379.png": {
    title: "Dazai Osamu - Extreme Close-Up Hazel Eyes & Bandages 4K",
    description: "Breathtaking high-fidelity close-up wallpaper of Dazai Osamu with detailed wavy brown hair, bandages, and introspective expression in 4K.",
    category: "Anime",
    tags: ["dazai", "dazai osamu", "bungou stray dogs", "bsd", "close up", "anime portrait", "no longer human", "anime wallpaper", "4k wallpaper", "amoled", "phone wallpaper"]
  },
  "Howl_Jenkins_Pendragon_flying__1789454555912.png": {
    title: "Howl Pendragon - Flight Above the Clouds with Feathered Wings 4K (Ghibli)",
    description: "Majestic 4K Studio Ghibli wallpaper of wizard Howl Jenkins Pendragon soaring through starry night skies with iridescent feathered black wings.",
    category: "Studio Ghibli",
    tags: ["howl", "howl jenkins pendragon", "howls moving castle", "studio ghibli", "hayao miyazaki", "sophie hatter", "calcifer", "ghibli aesthetic", "flying", "fantasy", "anime wallpaper", "4k wallpaper"]
  },
  "Howl_Jenkins_Pendragon_from_Ho_1789454434338.png": {
    title: "Howl Pendragon - Blonde Sorcerer Diamond Cloak 4K (Howl's Moving Castle)",
    description: "Gorgeous 4K Studio Ghibli art of Howl in his signature pink-and-grey diamond patterned sorcerer coat with emerald earrings.",
    category: "Studio Ghibli",
    tags: ["howl", "howl jenkins pendragon", "howls moving castle", "studio ghibli", "ghibli", "blonde anime", "calcifer", "aesthetic", "fairy tale", "anime wallpaper", "4k wallpaper"]
  },
  "Howl_Jenkins_Pendragon_inside__1789454638529.png": {
    title: "Howl's Secret Botanical Sanctuary & Magical Workshop 4K (Studio Ghibli)",
    description: "Enchanting interior wallpaper of wizard Howl inside his cluttered spell laboratory surrounded by glowing crystals, hanging plants, and ancient grimoires.",
    category: "Studio Ghibli",
    tags: ["howl", "howl jenkins pendragon", "howls moving castle", "studio ghibli", "magic shop", "witchcraft", "cozy vibes", "botanical", "anime wallpaper", "4k wallpaper"]
  },
  "close_up_portrait_of_Howl_Jenk_1789454592960.png": {
    title: "Howl Pendragon - Blue Eyes & Emerald Pendant Close-Up 4K (Ghibli)",
    description: "Ultra high-definition close-up portrait of Howl with stunning blue eyes, radiant blonde hair, and glowing magic jewelry in 4K.",
    category: "Studio Ghibli",
    tags: ["howl", "howl jenkins pendragon", "howls moving castle", "studio ghibli", "portrait", "close up", "emerald earring", "anime wallpaper", "4k wallpaper", "phone wallpaper"]
  },
  "Killua_Zoldyck__close_up_anime_1789458020381.png": {
    title: "Killua Zoldyck - Godspeed Electric Blue Eyes Close-Up 4K (Hunter x Hunter)",
    description: "Electrifying 4K close-up portrait of Killua Zoldyck with spiky silver hair, piercing cobalt blue eyes, and crackling lightning sparks.",
    category: "Anime",
    tags: ["killua", "killua zoldyck", "godspeed", "lightning nen", "hunter x hunter", "hxh", "gon freecss", "zoldyck", "assassin", "anime", "anime wallpaper", "4k wallpaper", "amoled"]
  },
  "Killua_Zoldyck_from_Hunter_x_H_1789455247317.png": {
    title: "Killua Zoldyck - Godspeed Thunderbolt Lightning Surge 4K (Hunter x Hunter)",
    description: "Dynamic action wallpaper of Killua Zoldyck activating Kanmuru (Godspeed) with intense cyan lightning bolts surrounding his body in 4K.",
    category: "Anime",
    tags: ["killua", "killua zoldyck", "godspeed", "kanmuru", "transmutation", "hunter x hunter", "hxh", "alluka", "gon", "anime wallpaper", "4k wallpaper", "dark anime"]
  },
  "Killua_Zoldyck_standing_under__1789457975298.png": {
    title: "Killua Zoldyck - Rainy Neon Alley Assassin Stance 4K (Hunter x Hunter)",
    description: "Atmospheric 4K wallpaper of Killua standing under a rainy street umbrella with subtle electrical charge in a cyberpunk alley.",
    category: "Anime",
    tags: ["killua", "killua zoldyck", "rainy days", "cyberpunk", "hunter x hunter", "hxh", "dark aesthetic", "anime wallpaper", "4k wallpaper", "amoled"]
  },
  "Levi_Ackerman__extreme_close_u_1789445990090.png": {
    title: "Levi Ackerman - Humanity's Strongest Fierce Steel Eyes 4K (AOT)",
    description: "Intense close-up portrait of Captain Levi Ackerman with sharp undercut hair, steely glare, and Survey Corps cravat in ultra 4K.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "captain levi", "attack on titan", "aot", "shingeki no kyojin", "survey corps", "eren yeager", "mikasa", "anime", "anime wallpaper", "4k wallpaper", "amoled"]
  },
  "Levi_Ackerman_from_Attack_on_T_1789445950528.png": {
    title: "Levi Ackerman - Survey Corps Wings of Freedom Battle Ready 4K (AOT)",
    description: "Masterpiece 4K wallpaper of Captain Levi Ackerman standing in full ODM gear with twin ultrahard steel blades and green Wings of Freedom cape.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "captain levi", "wings of freedom", "odm gear", "attack on titan", "aot", "shingeki no kyojin", "erwin smith", "titan slayer", "anime wallpaper", "4k wallpaper"]
  },
  "Levi_Ackerman_sitting_elegantl_1789446105194.png": {
    title: "Levi Ackerman - Black Tea Connoisseur Elegant Lounge 4K (AOT)",
    description: "Classy and refined 4K wallpaper of Captain Levi Ackerman sitting in an antique leather armchair holding his signature rim-grip black teacup.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "black tea", "tea cup", "attack on titan", "aot", "shingeki no kyojin", "aesthetic anime", "cozy vibes", "anime wallpaper", "4k wallpaper"]
  },
  "Levi_Ackerman_standing_on_a_hi_1789446047773.png": {
    title: "Levi Ackerman - Wall Maria Rooftop Sunset Sentinel 4K (AOT)",
    description: "Epic cinematic 4K wallpaper of Captain Levi Ackerman watching the sun dip below Wall Maria with cape billowing in the wind.",
    category: "Anime",
    tags: ["levi", "levi ackerman", "wall maria", "sunsets", "golden hour", "attack on titan", "aot", "shingeki no kyojin", "scout regiment", "anime wallpaper", "4k wallpaper"]
  },
  "Sebastian_Michaelis__close_up__1789453991405.png": {
    title: "Sebastian Michaelis - Demonic Crimson Eyes Close-Up 4K (Black Butler)",
    description: "Hypnotic 4K close-up wallpaper of demon butler Sebastian Michaelis with glowing red demonic eyes and charming sinister smirk.",
    category: "Anime",
    tags: ["sebastian", "sebastian michaelis", "black butler", "kuroshitsuji", "ciel phantomhive", "demon butler", "crimson eyes", "gothic anime", "anime wallpaper", "4k wallpaper", "amoled"]
  },
  "Sebastian_Michaelis_looking_do_1789454071241.png": {
    title: "Sebastian Michaelis - Victorian Moonlight Phantomhive Manor 4K",
    description: "Elegantly chilling 4K wallpaper of Sebastian Michaelis looking down with demonic poise amidst Victorian moonlight and gothic gargoyles.",
    category: "Anime",
    tags: ["sebastian", "sebastian michaelis", "black butler", "kuroshitsuji", "phantomhive", "victorian gothic", "dark mode", "anime wallpaper", "4k wallpaper", "amoled wallpapers"]
  },
  "Sebastian_Michaelis_sitting_el_1789454284388.png": {
    title: "Sebastian Michaelis - Silver Teapot Afternoon Service 4K (Black Butler)",
    description: "Flawless and sophisticated 4K wallpaper of Sebastian Michaelis pouring premium Earl Grey tea from an ornate silver teapot.",
    category: "Anime",
    tags: ["sebastian", "sebastian michaelis", "black butler", "kuroshitsuji", "afternoon tea", "butler", "aesthetic", "cozy vibes", "anime wallpaper", "4k wallpaper"]
  },
  "Sebastian_Michaelis_standing_i_1789454027167.png": {
    title: "Sebastian Michaelis - Faustian Contract Silver Cutlery 4K (Black Butler)",
    description: "Deadly butler art of Sebastian Michaelis wielding silver dining knives between gloved fingers with Faustian pentagram glove crest.",
    category: "Anime",
    tags: ["sebastian", "sebastian michaelis", "black butler", "kuroshitsuji", "faustian contract", "silver knives", "demon", "anime wallpaper", "4k wallpaper", "dark aesthetic"]
  },
  "Yato_from_Noragami_in_his_dark_1789458285157.png": {
    title: "Yato - God of Calamity Blood Moon Shinsu 4K (Noragami)",
    description: "Fierce and haunting 4K wallpaper of Yato in his dark ancient God of Calamity robes with blood moon and glowing blue eyes.",
    category: "Anime",
    tags: ["yato", "yaboku", "noragami", "noragami aragoto", "god of calamity", "yukine", "hiyori", "blood moon", "dark anime", "anime wallpaper", "4k wallpaper", "amoled"]
  },
  "Yato_from_Noragami_in_his_dark_1789458285204.png": {
    title: "Yato - Ancient God of War Sekki Blade Stance 4K (Noragami)",
    description: "Stunning 4K portrait of Yato wielding silver katana Sekki (Yukine) surrounded by cherry blossom petals and mystical azure spirit wisps.",
    category: "Anime",
    tags: ["yato", "noragami", "god of calamity", "sekki", "yukine regalia", "katana", "sword anime", "anime wallpaper", "4k wallpaper", "fantasy"]
  },
  "Yato_from_Noragami_standing_al_1789457456996.png": {
    title: "Yato - Delivery God Tokyo Shrine Sunset 4K (Noragami)",
    description: "Heartwarming 4K wallpaper of Yato wearing his iconic tracksuit and fluffy scarf standing on a traditional Tokyo Shinto shrine roof at sunset.",
    category: "Anime",
    tags: ["yato", "noragami", "delivery god", "tracksuit god", "shinto shrine", "sunsets", "golden hour", "hiyori iki", "anime wallpaper", "4k wallpaper", "aesthetic"]
  },
  "Yato_from_Noragami_standing_al_1789457784366.png": {
    title: "Yato - 5 Yen Coin Wish Granting God 4K (Noragami)",
    description: "Vibrant and cheerful 4K anime wallpaper of Yato tossing a golden 5-yen coin into the sky with signature bright blue eyes and confident grin.",
    category: "Anime",
    tags: ["yato", "noragami", "5 yen coin", "wish god", "yukine", "hiyori", "blue eyes anime", "anime wallpaper", "4k wallpaper", "aesthetic", "phone wallpaper"]
  }
};

async function uploadToCloudinary(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.secure_url;
}

async function bulkProcess() {
  const files = fs.readdirSync(SOURCE_DIR);
  console.log(`Starting bulk upload and SEO posting for ${files.length} images...`);

  let successCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const fullPath = path.join(SOURCE_DIR, filename);
    const meta = METADATA_MAP[filename];

    if (!meta) {
      console.warn(`[${i + 1}/${files.length}] No metadata found for ${filename}, skipping.`);
      continue;
    }

    console.log(`\n[${i + 1}/${files.length}] Uploading: "${meta.title}"...`);

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(fullPath);
      console.log(`  ✓ Cloudinary Hosted: ${imageUrl}`);

      // 2. Insert into Supabase
      const row = {
        title: meta.title,
        description: meta.description,
        image_url: imageUrl,
        category: meta.category,
        tags: meta.tags,
        likes: Math.floor(Math.random() * 15) + 5, // Seed with 5-20 organic likes
        link: null,
        author_name: AUTHOR.name,
        author_avatar: AUTHOR.avatar,
        author_username: AUTHOR.username
      };

      const { data, error } = await supabase.from("images").insert([row]).select();

      if (error) {
        console.error(`  ✗ Supabase Insert Error:`, error.message);
      } else {
        console.log(`  ✓ Supabase ID: ${data[0]?.id} published under ${AUTHOR.name}`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ✗ Failed processing ${filename}:`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`COMPLETED: ${successCount}/${files.length} Anime Wallpapers uploaded and posted under ${AUTHOR.name}!`);
  console.log(`========================================\n`);
}

bulkProcess().catch(console.error);
