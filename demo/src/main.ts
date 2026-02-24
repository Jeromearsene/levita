import { Levita } from "levita";
import "levita/style.css";

/** Initialize a Levita instance on an element found by ID. */
const init = (id: string, options: ConstructorParameters<typeof Levita>[1]) => {
	const el = document.getElementById(id);
	if (el) return new Levita(el, options);
};

// Simple tilt
init("card-basic", { gyroscope: false });
init("card-glare", { glare: true, maxGlare: 0.4, gyroscope: false });
init("card-shadow", { shadow: true, gyroscope: false });
init("card-full", { glare: true, shadow: true, gyroscope: false });

// Parallax layers
init("card-parallax", { glare: true, gyroscope: false });

// Playground
{
	const playgroundEl = document.getElementById("card-playground");
	const controls = document.getElementById("playground-controls");

	if (playgroundEl && controls) {
		let playgroundInstance = new Levita(playgroundEl, { gyroscope: false });

		const input = (id: string) => document.getElementById(`ctrl-${id}`) as HTMLInputElement;

		const readOptions = () => ({
			max: Number(input("max").value),
			perspective: Number(input("perspective").value),
			scale: Number(input("scale").value),
			speed: Number(input("speed").value),
			reverse: input("reverse").checked,
			glare: input("glare").checked,
			maxGlare: Number(input("maxGlare").value),
			shadow: input("shadow").checked,
			disabled: input("disabled").checked,
			gyroscope: false as const,
		});

		const syncOutputs = () => {
			for (const id of ["max", "perspective", "scale", "speed", "maxGlare"]) {
				const out = document.getElementById(`out-${id}`);
				if (out) out.textContent = input(id).value;
			}
		};

		controls.addEventListener("input", () => {
			syncOutputs();
			playgroundInstance.destroy();
			playgroundInstance = new Levita(playgroundEl, readOptions());
		});
	}
}

// Gyroscope
const gyroInstance = init("card-gyro", { gyroscope: "auto", glare: true, shadow: true });
const gyroInfo = document.getElementById("gyro-info");

if (gyroInstance && gyroInfo) {
	gyroInstance.on("move", ({ x, y }) => {
		gyroInfo.textContent = `Gyro active — x: ${x.toFixed(1)}° y: ${y.toFixed(1)}°`;
	});
}
