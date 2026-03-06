import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("size-results.json", "utf8"));

if (!fs.existsSync("badges")) {
	fs.mkdirSync("badges");
}

// Core badges
const core = data.find((d) => d.name === "levita-js") || data[0];
const coreContent = JSON.stringify({
	schemaVersion: 1,
	label: "gzip",
	message: `${(core.size / 1024).toFixed(1)} kB`,
	color: "brightgreen",
});
fs.writeFileSync("badges/badge-size.json", coreContent);
fs.writeFileSync("badges/badge-size-core.json", coreContent);

// Package badges
for (const entry of data) {
	const slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
	fs.writeFileSync(
		`badges/badge-size-${slug}.json`,
		JSON.stringify({
			schemaVersion: 1,
			label: "gzip",
			message: `${(entry.size / 1024).toFixed(1)} kB`,
			color: "brightgreen",
		}),
	);
}
