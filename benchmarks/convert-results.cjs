/** Converts Vitest bench text output to github-action-benchmark JSON format. */
const fs = require("node:fs");

const raw = fs.readFileSync("bench-raw.txt", "utf8");
const lines = raw.split("\n").filter((l) => l.includes("·"));
const results = lines
	.map((line) => {
		// Matches: · Name   12,345.67
		// Matches even with different whitespace or characters
		const match = line.match(/·\s+(.+?)\s+([\d,.]+)/);
		if (!match) return null;
		return {
			name: match[1].trim(),
			unit: "ops/sec",
			value: parseFloat(match[2].replace(/,/g, "")),
		};
	})
	.filter(Boolean);

fs.writeFileSync("bench-results.json", JSON.stringify(results, null, 2));
