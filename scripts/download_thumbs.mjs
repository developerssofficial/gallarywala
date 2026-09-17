import fs from "fs";
import path from "path";
import https from "https";

const urls = {
  7: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789358750/dmug2tjqcsthzzky3t7h.jpg",
  9: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789368558/pkkgmcsuyrcrazoytapt.jpg",
  10: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789368715/h3wmrtjg6ckygb8no79c.jpg",
  11: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789368787/izzqptex5pswtkr3o5zj.jpg",
  12: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789368814/tzp8zg8pjaspstjrw9dx.jpg",
  13: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789368897/yojikjewl35rcdeqect5.jpg",
  14: "https://res.cloudinary.com/nho4ptej/image/upload/w_300,c_scale/v1789370066/dizprv1o7pyhyaai34hr.jpg"
};

const dir = "C:/Users/user/.gemini/antigravity-ide/brain/0a71bf3f-8c3d-48cc-859f-4713490640b7/.tempmediaStorage";

for (const [id, u] of Object.entries(urls)) {
  const filePath = path.join(dir, `anime_${id}.jpg`);
  const file = fs.createWriteStream(filePath);
  https.get(u, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${id}`);
    });
  });
}
