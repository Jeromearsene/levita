import fs from "node:fs";
import path from "node:path";

/**
 * Automatically synchronizes the version of Levita packages in all example projects
 * and peerDependencies in official packages with the current version found in packages/core/package.json.
 */

const ROOT = process.cwd();
const CORE_PKG_PATH = path.join(ROOT, "packages/core/package.json");
const EXAMPLES_DIR = path.join(ROOT, "examples");
const PACKAGES_DIR = path.join(ROOT, "packages");

// Get the current target version from core
const corePkg = JSON.parse(fs.readFileSync(CORE_PKG_PATH, "utf8"));
const version = corePkg.version;

console.log(`Syncing workspace to version: ${version}`);

/** Sync a package.json file with the target version. */
function syncPackageJson(pkgPath, isExample = false) {
	if (!fs.existsSync(pkgPath)) return;

	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	let changed = false;

	// Update dependencies (for examples)
	if (pkg.dependencies) {
		for (const dep of Object.keys(pkg.dependencies)) {
			if (dep === "levita-js" || dep.startsWith("@levita-js/")) {
				const targetValue = isExample ? `^${version}` : "workspace:*";
				if (pkg.dependencies[dep] !== targetValue) {
					pkg.dependencies[dep] = targetValue;
					changed = true;
				}
			}
		}
	}

	// Update peerDependencies (for official wrappers)
	if (pkg.peerDependencies) {
		for (const dep of Object.keys(pkg.peerDependencies)) {
			if (dep === "levita-js") {
				const targetValue = `>=${version}`;
				if (pkg.peerDependencies[dep] !== targetValue) {
					pkg.peerDependencies[dep] = targetValue;
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

// 1. Sync all examples
for (const example of fs.readdirSync(EXAMPLES_DIR)) {
	syncPackageJson(path.join(EXAMPLES_DIR, example, "package.json"), true);
}

// 2. Sync all official packages peerDeps
for (const pkg of fs.readdirSync(PACKAGES_DIR)) {
	if (pkg === "core") continue;
	syncPackageJson(path.join(PACKAGES_DIR, pkg, "package.json"), false);
}
