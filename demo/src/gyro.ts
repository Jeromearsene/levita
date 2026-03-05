import { init } from "./lib.js";

export function initGyro() {
	const gyroInstance = init("card-gyro", { gyroscope: "auto", glare: true, shadow: true });
	const gyroInfo = document.getElementById("gyro-info");

	if (gyroInstance && gyroInfo) {
		gyroInstance.on("move", ({ x, y }) => {
			gyroInfo.textContent = `Gyro active — x: ${x.toFixed(1)}° y: ${y.toFixed(1)}°`;
		});
	}
}
