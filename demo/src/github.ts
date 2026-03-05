export const fetchStars = async () => {
	const starEl = document.getElementById("github-stars");
	if (!starEl) return;

	try {
		const response = await fetch("https://api.github.com/repos/Jeromearsene/levita");
		const data = await response.json();
		if (data.stargazers_count !== undefined) {
			starEl.textContent = `${data.stargazers_count.toLocaleString()} stars`;
		} else {
			starEl.textContent = "GitHub";
		}
	} catch {
		starEl.textContent = "GitHub";
	}
};
