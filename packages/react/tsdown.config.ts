import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.tsx"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	external: ["react", "react-dom", "levita"],
});
