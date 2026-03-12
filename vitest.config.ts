import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"levita-js": resolve(__dirname, "packages/core/src/index.ts"),
			"@levita-js/react": resolve(__dirname, "packages/react/src/index.tsx"),
			"@levita-js/vue": resolve(__dirname, "packages/vue/src/index.ts"),
			"@levita-js/svelte": resolve(__dirname, "packages/svelte/src/index.ts"),
			"@levita-js/angular": resolve(__dirname, "packages/angular/src/index.ts"),
			"@levita-js/haptics": resolve(__dirname, "packages/haptics/src/index.ts"),
		},
	},
	test: {
		environment: "happy-dom",
		exclude: ["tests/visual/**", "node_modules/**"],
	},
});
