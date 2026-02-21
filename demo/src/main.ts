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

// Gyroscope
init("card-gyro", { gyroscope: "auto", glare: true, shadow: true });

// Update gyro info
const gyroInfo = document.getElementById("gyro-info");
if (gyroInfo && !("DeviceOrientationEvent" in window)) {
	gyroInfo.textContent = "Gyroscope not available on this device.";
}
