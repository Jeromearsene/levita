import fs from "node:fs";

if (!fs.existsSync("bench-results.json")) {
	console.log("No benchmark results found");
	process.exit(0);
}

if (!fs.existsSync("badges")) {
	fs.mkdirSync("badges");
}

const data = JSON.parse(fs.readFileSync("bench-results.json", "utf8"));

for (const entry of data) {
	const slug = entry.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace("levita-levita", "levita");
	const value =
		entry.value >= 1000 ? `~${Math.round(entry.value / 1000)}k` : Math.round(entry.value);

	fs.writeFileSync(
		`badges/badge-bench-${slug}.json`,
		JSON.stringify({
			schemaVersion: 1,
			label: entry.name.split(/[-—–]/).pop().trim(),
			message: `${value} ops/s`,
			color: "blue",
		}),
	);
}
