import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"levita-js": resolve(__dirname, "packages/core/src/index.ts"),
		},
	},
	test: {
		environment: "happy-dom",
		exclude: ["tests/visual/**", "node_modules/**"],
	},
});
