import fs from "node:fs";

const path = "compat-results";
if (!fs.existsSync(path)) {
	console.log("No compatibility results found");
	process.exit(0);
}

if (!fs.existsSync("badges")) {
	fs.mkdirSync("badges");
}

const files = fs.readdirSync(path);
const packages = ["react", "svelte", "vue", "angular"];
const results = {};

for (const file of files) {
	if (!file.endsWith(".txt")) continue;
	// Extract package and version from filename like 'react-16.8.0.txt'
	const parts = file.replace(".txt", "").split(/-(?=[0-9])/);
	const pkg = parts[0];
	const version = parts[1];
	const status = fs.readFileSync(`${path}/${file}`, "utf8").trim();
	if (!results[pkg]) results[pkg] = [];
	results[pkg].push({ version, status });
}

for (const pkg of packages) {
	const pkgResults = results[pkg] || [];
	const successful = pkgResults.filter((r) => r.status === "success");

	let versionDisplay = "unknown";
	if (successful.length > 0) {
		// Find minimum version
		const sorted = successful
			.map((r) => r.version)
			.sort((a, b) => {
				const partsA = a.split(".").map(Number);
				const partsB = b.split(".").map(Number);
				for (let i = 0; i < 3; i++) {
					if ((partsA[i] || 0) < (partsB[i] || 0)) return -1;
					if ((partsA[i] || 0) > (partsB[i] || 0)) return 1;
				}
				return 0;
			});
		const minVersion = sorted[0];
		// For the badge, we usually show major or major.minor
		const parts = minVersion.split(".");
		versionDisplay = `${parts[0] === "0" ? `${parts[0]}.${parts[1]}` : parts[0]}+`;
	} else {
		// Fallback to peerDependencies if no tests succeeded
		try {
			const content = JSON.parse(fs.readFileSync(`packages/${pkg}/package.json`, "utf8"));
			const peerDeps = content.peerDependencies || {};
			const frameworkName = pkg === "angular" ? "@angular/core" : pkg;
			const version = peerDeps[frameworkName] || "unknown";
			versionDisplay = `${version.replace(">=", "")}+`;
		} catch (_e) {}
	}

	fs.writeFileSync(
		`badges/badge-version-${pkg}.json`,
		JSON.stringify({
			schemaVersion: 1,
			label: "version",
			message: versionDisplay,
			color: "blue",
		}),
	);
}
