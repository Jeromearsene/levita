import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/levita/",
	root: ".",
	resolve: {
		alias: {
			"@assets": fileURLToPath(new URL("./assets", import.meta.url)),
		},
	},
	build: {
		outDir: "dist",
	},
	plugins: [tailwindcss(), preact()],
});
