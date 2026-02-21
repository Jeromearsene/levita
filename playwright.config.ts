import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests/visual",
	snapshotDir: "tests/visual/snapshots",
	snapshotPathTemplate: "{snapshotDir}/{testName}/{arg}{ext}",
	use: {
		browserName: "chromium",
		viewport: { width: 400, height: 300 },
		deviceScaleFactor: 2,
	},
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.02,
		},
	},
});
