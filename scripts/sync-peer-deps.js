import fs from "node:fs";
import path from "node:path";

/**
 * Synchronizes peerDependencies in official wrapper packages
 * with the current version found in packages/core/package.json.
 *
 * Examples are synced separately after publish (see release.yml)
 * so they always reference real npm versions for StackBlitz compatibility.
 */

const ROOT = process.cwd();
const CORE_PKG_PATH = path.join(ROOT, "packages/core/package.json");
const PACKAGES_DIR = path.join(ROOT, "packages");

const corePkg = JSON.parse(fs.readFileSync(CORE_PKG_PATH, "utf8"));
const version = corePkg.version;

console.log(`Syncing peerDependencies to version: ${version}`);

for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
	if (pkg === "core") continue;
	const pkgPath = path.join(PACKAGES_DIR, pkg, "package.json");
	if (!fs.existsSync(pkgPath)) continue;

	const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	let changed = false;

	if (pkgJson.peerDependencies) {
		for (const dep of Object.keys(pkgJson.peerDependencies)) {
			if (dep === "levita-js") {
				const targetValue = `>=${version}`;
				if (pkgJson.peerDependencies[dep] !== targetValue) {
					pkgJson.peerDependencies[dep] = targetValue;
					changed = true;
				}
			}
		}
	}

	if (changed) {
		fs.writeFileSync(pkgPath, `${JSON.stringify(pkgJson, null, "\t")}\n`);
		console.log(`✅ Updated ${path.relative(ROOT, pkgPath)}`);
	}
}
