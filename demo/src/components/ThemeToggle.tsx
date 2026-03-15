import { useEffect, useState } from "preact/hooks";

type ThemeMode = "auto" | "light" | "dark";

const MODES: ThemeMode[] = ["auto", "light", "dark"];

const applyTheme = (mode: ThemeMode) => {
	const isDark =
		mode === "dark" || (mode === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", isDark);
};

const getStoredMode = (): ThemeMode => {
	const stored = localStorage.getItem("theme");
	if (stored === "light" || stored === "dark") return stored;
	return "auto";
};

export function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>(getStoredMode);

	useEffect(() => {
		applyTheme(mode);

		if (mode === "auto") {
			localStorage.removeItem("theme");
			const mediaQuery = matchMedia("(prefers-color-scheme: dark)");
			const handler = () => applyTheme("auto");
			mediaQuery.addEventListener("change", handler);
			return () => mediaQuery.removeEventListener("change", handler);
		}

		localStorage.setItem("theme", mode);
	}, [mode]);

	const cycle = () => {
		setMode((current) => {
			const next = MODES[(MODES.indexOf(current) + 1) % MODES.length];
			return next ?? "auto";
		});
	};

	return (
		<button
			type="button"
			onClick={cycle}
			class="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text hover:border-overlay transition"
			title={`Theme: ${mode}`}
		>
			{mode === "auto" && (
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<title>Auto theme</title>
					<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
					<line x1="8" y1="21" x2="16" y2="21" />
					<line x1="12" y1="17" x2="12" y2="21" />
				</svg>
			)}
			{mode === "light" && (
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<title>Light theme</title>
					<circle cx="12" cy="12" r="5" />
					<line x1="12" y1="1" x2="12" y2="3" />
					<line x1="12" y1="21" x2="12" y2="23" />
					<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
					<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
					<line x1="1" y1="12" x2="3" y2="12" />
					<line x1="21" y1="12" x2="23" y2="12" />
					<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
					<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
				</svg>
			)}
			{mode === "dark" && (
				<svg
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<title>Dark theme</title>
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
				</svg>
			)}
		</button>
	);
}
