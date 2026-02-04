import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
	base: "/harry-fischer-svelte-2025/",
	plugins: [svelte()],
});
