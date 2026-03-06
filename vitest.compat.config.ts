import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			// In isolated compatibility tests, we point to the local node_modules of the temp dir
			"levita-js": resolve(process.cwd(), "node_modules/levita-js/dist/index.mjs"),
		},
	},
	test: {
		environment: "happy-dom",
		exclude: ["tests/visual/**", "node_modules/**"],
	},
});
