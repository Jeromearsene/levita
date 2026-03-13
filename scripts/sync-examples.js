import fs from "node:fs";
import path from "node:path";

/**
 * Synchronizes Levita dependency versions in all example projects
 * to match the just-published version from packages/core/package.json.
 *
 * This script runs AFTER npm publish (in release.yml) so the versions
 * are guaranteed to exist on the registry, keeping examples compatible
 * with StackBlitz and other online sandboxes.
 */

const ROOT = process.cwd();
const CORE_PKG_PATH = path.join(ROOT, "packages/core/package.json");
const EXAMPLES_DIR = path.join(ROOT, "examples");

const corePkg = JSON.parse(fs.readFileSync(CORE_PKG_PATH, "utf8"));
const version = corePkg.version;

console.log(`Syncing examples to version: ^${version}`);

for (const example of fs.readdirSync(EXAMPLES_DIR)) {
	const pkgPath = path.join(EXAMPLES_DIR, example, "package.json");
	if (!fs.existsSync(pkgPath)) continue;

	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	let changed = false;

	if (pkg.dependencies) {
		for (const dep of Object.keys(pkg.dependencies)) {
			if (dep === "levita-js" || dep.startsWith("@levita-js/")) {
				const targetValue = `^${version}`;
				if (pkg.dependencies[dep] !== targetValue) {
					pkg.dependencies[dep] = targetValue;
					changed = true;
				}
			}
		}
	}

	if (changed) {
		fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);
		console.log(`✅ Updated ${path.relative(ROOT, pkgPath)}`);
	}
}
