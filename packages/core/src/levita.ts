import { DEFAULT_OPTIONS } from "./constants.js";
import { GlareEffect } from "./effects/glare.js";
import { ShadowEffect } from "./effects/shadow.js";
import type { Layer } from "./layers.js";
import { cleanupLayers, scanLayers } from "./layers.js";
import { MotionSensor } from "./sensors/motion.js";
import type { SensorOutput } from "./sensors/pointer.js";
import { PointerSensor } from "./sensors/pointer.js";
import type { EventCallback, LevitaEventMap, LevitaOptions, TiltValues } from "./types.js";

/**
 * Main entry point for the Levita 3D tilt effect.
 *
 * Orchestrates sensors (pointer, accelerometer), visual effects (glare, shadow),
 * and multi-layer parallax. All rendering is driven by CSS custom properties —
 * no requestAnimationFrame loop runs during interaction.
 *
 * @example
 * ```ts
 * import { Levita } from 'levita-js';
 * import 'levita-js/style.css';
 *
 * const tilt = new Levita(element, { glare: true, shadow: true });
 * tilt.on('move', ({ x, y }) => console.log(x, y));
 * ```
 */
export class Levita {
	private el: HTMLElement;
	private options: LevitaOptions;
	private pointerSensor: PointerSensor;
	private motionSensor: MotionSensor | null = null;
	private glareEffect: GlareEffect | null = null;
	private shadowEffect: ShadowEffect | null = null;
	private layers: Layer[] = [];
	private listeners = new Map<string, Set<EventCallback<unknown>>>();
	private destroyed = false;
	private gyroscopeRequested = false;

	/**
	 * @param el - The DOM element to apply the tilt effect to
	 * @param options - Configuration options (all optional, sensible defaults)
	 */
	constructor(el: HTMLElement, options: Partial<LevitaOptions> = {}) {
		this.el = el;
		this.options = { ...DEFAULT_OPTIONS, ...options };

		this.el.classList.add("levita");
		this.applyBaseProperties();

		this.layers = scanLayers(this.el);

		if (this.options.glare) {
			this.glareEffect = new GlareEffect(this.el, this.options.maxGlare);
		}
		if (this.options.shadow) {
			this.shadowEffect = new ShadowEffect(this.el);
		}

		this.pointerSensor = new PointerSensor(
			this.el,
			(values) => this.handleSensorInput(values),
			() => this.handleEnter(),
			() => this.handleLeave(),
			this.options.axis,
			this.options.eventsEl,
		);

		if (this.options.gyroscope !== false && MotionSensor.isSupported()) {
			this.motionSensor = new MotionSensor(
				(values) => this.handleSensorInput(values),
				this.options.axis,
			);

			if (this.options.gyroscope === "auto") {
				this.el.addEventListener("click", this.handleFirstTouch, { once: true });
			}
		}

		if (!this.options.disabled) {
			this.enable();
		}
	}

	/**
	 * On first touch (iOS auto mode), request accelerometer permission
	 * and switch from pointer to motion sensor if granted.
	 */
	private handleFirstTouch = async (): Promise<void> => {
		if (this.gyroscopeRequested || !this.motionSensor) return;
		this.gyroscopeRequested = true;

		const granted = await this.motionSensor.requestPermission();
		if (granted) {
			this.pointerSensor.stop();
			this.setTransition(false);
			this.motionSensor.start();
		}
	};

	/** Re-enable the tilt effect after a `disable()` call. */
	enable = (): void => {
		if (this.destroyed) return;
		this.options.disabled = false;
		this.pointerSensor.start();
	};

	/** Pause the tilt effect and reset the element to its neutral position. */
	disable = (): void => {
		this.options.disabled = true;
		this.pointerSensor.stop();
		this.motionSensor?.stop();
		this.resetTransform();
	};

	/**
	 * Manually request accelerometer permission (for `gyroscope: true` mode).
	 * Must be called from a user gesture on iOS 13+.
	 *
	 * @returns Whether permission was granted
	 */
	requestPermission = async (): Promise<boolean> => {
		if (!this.motionSensor) return false;
		const granted = await this.motionSensor.requestPermission();
		if (granted) {
			this.pointerSensor.stop();
			this.setTransition(false);
			this.motionSensor.start();
		}
		return granted;
	};

	/**
	 * Fully clean up: stop sensors, remove effects, restore the element
	 * to its original state. The instance cannot be reused after this.
	 */
	destroy = (): void => {
		if (this.destroyed) return;
		this.destroyed = true;

		this.pointerSensor.stop();
		this.motionSensor?.stop();
		this.glareEffect?.destroy();
		this.shadowEffect?.destroy();
		cleanupLayers(this.layers);

		this.el.classList.remove("levita");
		this.removeBaseProperties();
		this.listeners.clear();

		this.el.removeEventListener("click", this.handleFirstTouch);
	};

	/**
	 * Register an event listener.
	 *
	 * @param event - Event name: 'move', 'enter', or 'leave'
	 * @param callback - Handler function
	 */
	on = <K extends keyof LevitaEventMap>(
		event: K,
		callback: EventCallback<LevitaEventMap[K]>,
	): void => {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)?.add(callback as EventCallback<unknown>);
	};

	/**
	 * Remove a previously registered event listener.
	 *
	 * @param event - Event name
	 * @param callback - The exact handler reference passed to `on()`
	 */
	off = <K extends keyof LevitaEventMap>(
		event: K,
		callback: EventCallback<LevitaEventMap[K]>,
	): void => {
		this.listeners.get(event)?.delete(callback as EventCallback<unknown>);
	};

	/** Emit an event to all registered listeners. */
	private emit = <K extends keyof LevitaEventMap>(event: K, data: LevitaEventMap[K]): void => {
		const callbacks = this.listeners.get(event);
		if (callbacks) {
			for (const cb of callbacks) {
				cb(data);
			}
		}
	};

	/**
	 * Process normalized sensor input and update CSS custom properties.
	 * Maps sensor X/Y to rotateY/rotateX (swapped, rotateX = vertical tilt).
	 */
	private handleSensorInput = (input: SensorOutput): void => {
		if (this.options.disabled) return;

		const multiplier = this.options.reverse ? -1 : 1;
		const x = input.y * this.options.max * multiplier;
		const y = input.x * this.options.max * multiplier * -1;

		this.el.style.setProperty("--levita-x", `${x}deg`);
		this.el.style.setProperty("--levita-y", `${y}deg`);
		this.el.style.setProperty("--levita-scale", String(this.options.scale));
		this.el.style.setProperty("--levita-percent-x", String(input.x));
		this.el.style.setProperty("--levita-percent-y", String(input.y));

		this.glareEffect?.update(input.x, input.y);
		this.shadowEffect?.update(input.x, input.y);

		const values: TiltValues = {
			x,
			y,
			percentX: input.x,
			percentY: input.y,
		};
		this.emit("move", values);
	};

	private handleEnter = (): void => {
		this.setTransition(false);
		this.el.style.setProperty("--levita-scale", String(this.options.scale));
		this.emit("enter", undefined);
	};

	private handleLeave = (): void => {
		this.setTransition(true);
		if (this.options.reset) {
			this.resetTransform();
		}
		this.emit("leave", undefined);
	};

	/** Toggle the CSS transition on or off. */
	private setTransition = (on: boolean): void => {
		this.el.style.setProperty("--levita-speed", on ? `${this.options.speed}ms` : "0ms");
	};

	/** Reset the element to its neutral (non-tilted) position. */
	private resetTransform = (): void => {
		this.el.style.setProperty("--levita-x", "0deg");
		this.el.style.setProperty("--levita-y", "0deg");
		this.el.style.setProperty("--levita-scale", "1");
		this.el.style.setProperty("--levita-percent-x", "0");
		this.el.style.setProperty("--levita-percent-y", "0");
		this.glareEffect?.update(0, 0);
		this.shadowEffect?.update(0, 0);
	};

	/** Apply initial CSS custom properties from options. */
	private applyBaseProperties = (): void => {
		this.el.style.setProperty("--levita-perspective", `${this.options.perspective}px`);
		this.el.style.setProperty("--levita-speed", `${this.options.speed}ms`);
		this.el.style.setProperty("--levita-easing", this.options.easing);
	};

	/** Remove all Levita CSS custom properties from the element. */
	private removeBaseProperties = (): void => {
		this.el.style.removeProperty("--levita-perspective");
		this.el.style.removeProperty("--levita-speed");
		this.el.style.removeProperty("--levita-easing");
		this.el.style.removeProperty("--levita-x");
		this.el.style.removeProperty("--levita-y");
		this.el.style.removeProperty("--levita-scale");
		this.el.style.removeProperty("--levita-percent-x");
		this.el.style.removeProperty("--levita-percent-y");
	};
}
