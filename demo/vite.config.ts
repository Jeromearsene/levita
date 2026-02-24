import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/levita/",
	root: ".",
	build: {
		outDir: "dist",
	},
	plugins: [tailwindcss()],
});
