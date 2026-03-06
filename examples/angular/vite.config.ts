import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [angular()],
	resolve: {
		mainFields: ["module"],
	},
});
