import fs from "node:fs";
import path from "node:path";

/**
 * Automatically synchronizes the version of Levita packages in all example projects
 * with the current version found in packages/core/package.json.
 */

const ROOT = process.cwd();
const CORE_PKG_PATH = path.join(ROOT, "packages/core/package.json");
const EXAMPLES_DIR = path.join(ROOT, "examples");

// Get the current target version from core
const corePkg = JSON.parse(fs.readFileSync(CORE_PKG_PATH, "utf8"));
const version = corePkg.version;

console.log(`Syncing examples to version: ^${version}`);

const examples = fs.readdirSync(EXAMPLES_DIR);

for (const example of examples) {
	const examplePath = path.join(EXAMPLES_DIR, example);
	const pkgPath = path.join(examplePath, "package.json");

	if (fs.existsSync(pkgPath)) {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		let changed = false;

		if (pkg.dependencies) {
			for (const dep of Object.keys(pkg.dependencies)) {
				// Check for our own packages
				if (dep === "levita-js" || dep.startsWith("@levita-js/")) {
					if (pkg.dependencies[dep] !== `^${version}`) {
						pkg.dependencies[dep] = `^${version}`;
						changed = true;
					}
				}
			}
		}

		if (changed) {
			fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);
			console.log(`✅ Updated ${example}/package.json`);
		}
	}
}
