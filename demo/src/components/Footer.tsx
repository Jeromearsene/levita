import { useEffect, useState } from "preact/hooks";

/**
 * Site footer with external links and real-time GitHub stars counter.
 */
export function Footer() {
	const [githubStars, setGithubStars] = useState("GitHub");

	useEffect(() => {
		/** Fetches the stargazer count from GitHub API. */
		fetch("https://api.github.com/repos/Jeromearsene/levita")
			.then((res) => res.json())
			.then((data) => {
				if (data.stargazers_count !== undefined) {
					setGithubStars(`${data.stargazers_count.toLocaleString()} stars`);
				}
			})
			.catch(() => {});
	}, []);

	return (
		<footer class="border-t border-border mt-16 px-8 py-8">
			<div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
				<span class="bg-linear-to-br from-accent to-accent-end bg-clip-text text-transparent font-bold text-lg">
					Levita
				</span>
				<nav class="flex items-center gap-6">
					<a
						href="https://github.com/Jeromearsene/levita"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-text-secondary hover:text-text hover:border-overlay transition group"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							class="group-hover:scale-110 transition-transform text-text-muted group-hover:text-text"
						>
							<title>GitHub</title>
							<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
						</svg>
						<span class="text-xs font-medium">{githubStars}</span>
					</a>
					<a
						href="https://www.npmjs.com/package/levita"
						target="_blank"
						rel="noopener noreferrer"
						class="text-text-secondary text-sm hover:text-text transition"
					>
						npm
					</a>
					<a
						href="https://github.com/users/Jeromearsene/projects/7"
						target="_blank"
						rel="noopener noreferrer"
						class="text-text-secondary text-sm hover:text-text transition"
					>
						Roadmap
					</a>
					<a
						href="https://github.com/Jeromearsene/levita#api"
						target="_blank"
						rel="noopener noreferrer"
						class="text-text-secondary text-sm hover:text-text transition"
					>
						Documentation
					</a>
				</nav>
			</div>
		</footer>
	);
}
