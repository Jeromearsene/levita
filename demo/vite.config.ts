import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
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
	optimizeDeps: {
		entries: ["index.html"],
	},
	server: {
		host: true,
	},
	plugins: [tailwindcss(), preact(), basicSsl()],
});
