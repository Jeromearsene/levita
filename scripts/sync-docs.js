import fs from "node:fs";
import path from "node:path";

/**
 * Automatically synchronizes LICENSE files from the root to all official packages
 * and ensures each package has a README.md file.
 */

const ROOT = process.cwd();
const PACKAGES_DIR = path.join(ROOT, "packages");
const LICENSE_PATH = path.join(ROOT, "LICENSE");

if (!fs.existsSync(LICENSE_PATH)) {
	console.error("❌ Root LICENSE file not found!");
	process.exit(1);
}

const packages = fs.readdirSync(PACKAGES_DIR);
let hasErrors = false;

for (const pkg of packages) {
	const pkgPath = path.join(PACKAGES_DIR, pkg);
	if (!fs.statSync(pkgPath).isDirectory()) continue;

	// 1. Copy LICENSE
	fs.copyFileSync(LICENSE_PATH, path.join(pkgPath, "LICENSE"));
	console.log(`✅ Copied LICENSE to packages/${pkg}`);

	// 2. Check for README
	const readmePath = path.join(pkgPath, "README.md");
	if (!fs.existsSync(readmePath)) {
		console.error(`❌ Error: README.md is missing in packages/${pkg}`);
		hasErrors = true;
	}
}

if (hasErrors) {
	process.exit(1);
}
