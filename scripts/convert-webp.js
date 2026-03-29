#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "../public/assets");

const imageFiles = fs
	.readdirSync(assetsDir)
	.filter((file) =>
		[".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase()),
	);

if (imageFiles.length === 0) {
	console.log("No image files found in public/assets");
	process.exit(0);
}

console.log(`Found ${imageFiles.length} image(s). Converting to WebP...\n`);

imageFiles.forEach((imageFile) => {
	const inputPath = path.join(assetsDir, imageFile);
	const webpName = path.basename(imageFile, path.extname(imageFile)) + ".webp";
	const outputPath = path.join(assetsDir, webpName);

	if (fs.existsSync(outputPath)) {
		console.log(`✓ ${webpName} (already exists)`);
		return;
	}

	try {
		execSync(`cwebp -q 82 "${inputPath}" -o "${outputPath}"`, {
			stdio: "pipe",
		});
		console.log(`✓ Converted ${imageFile} → ${webpName}`);
	} catch (error) {
		console.error(`✗ Failed to convert ${imageFile}`);
		console.error(error.message);
	}
});

console.log("\nDone!");
