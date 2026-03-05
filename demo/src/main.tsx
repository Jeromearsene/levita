import { render } from "preact";
import { App } from "./App";
import "./style.css";

const appEl = document.getElementById("app");
if (appEl) {
	render(<App />, appEl);
}
