#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "../public/assets");

// Get all video files
const videoFiles = fs
	.readdirSync(assetsDir)
	.filter((file) =>
		[".mp4", ".webm", ".mov"].includes(path.extname(file).toLowerCase()),
	);

if (videoFiles.length === 0) {
	console.log("No video files found in public/assets");
	process.exit(0);
}

console.log(`Found ${videoFiles.length} video(s). Generating posters...\n`);

videoFiles.forEach((videoFile) => {
	const videoPath = path.join(assetsDir, videoFile);
	const posterName =
		path.basename(videoFile, path.extname(videoFile)) + "-poster.jpg";
	const posterPath = path.join(assetsDir, posterName);

	// Skip if poster already exists
	if (fs.existsSync(posterPath)) {
		console.log(`✓ ${posterName} (already exists)`);
		return;
	}

	try {
		// Extract first frame at 1 second (or start if shorter)
		const command = `ffmpeg -i "${videoPath}" -ss 0 -vf "scale=1280:-1" -q:v 3 -vframes 1 "${posterPath}" -y`;
		execSync(command, { stdio: "pipe" });
		console.log(`✓ Generated ${posterName}`);
	} catch (error) {
		console.error(`✗ Failed to generate poster for ${videoFile}`);
		console.error(error.message);
	}
});

console.log("\nDone!");
