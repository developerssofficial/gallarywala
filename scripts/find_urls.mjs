import { execSync } from "child_process";
import fs from "fs";

const log = execSync("git log -p -n 30", { maxBuffer: 10 * 1024 * 1024 }).toString();
const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-\?\=\&\_]+/g;
const matches = log.match(regex) || [];
const unique = [...new Set(matches)];
console.log("Found Unsplash URLs in git history:");
unique.forEach(u => console.log(u));
