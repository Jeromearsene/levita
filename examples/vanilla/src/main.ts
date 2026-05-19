import { Levita } from "@levita-js/core";
import "@levita-js/core/style.css";

const card = document.getElementById("card");
if (card) {
	new Levita(card, {
		glare: true,
		maxGlare: 0.5,
		shadow: true,
	});
}
