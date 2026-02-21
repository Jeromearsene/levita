import { GlareEffect } from "./effects/glare.js";
import { ShadowEffect } from "./effects/shadow.js";
import type { Layer } from "./layers.js";
import { cleanupLayers, scanLayers } from "./layers.js";
import { MotionSensor } from "./sensors/motion.js";
import type { SensorOutput } from "./sensors/pointer.js";
import { PointerSensor } from "./sensors/pointer.js";
import {
	DEFAULT_OPTIONS,
	type EventCallback,
	type LevitaEventMap,
	type LevitaOptions,
	type TiltValues,
} from "./types.js";

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
		);

		if (this.options.gyroscope !== false && MotionSensor.isSupported()) {
			this.motionSensor = new MotionSensor(
				(values) => this.handleSensorInput(values),
				this.options.axis,
			);

			if (this.options.gyroscope === "auto") {
				this.el.addEventListener("touchstart", this.handleFirstTouch, { once: true });
			}
		}

		if (!this.options.disabled) {
			this.enable();
		}
	}

	private handleFirstTouch = async (): Promise<void> => {
		if (this.gyroscopeRequested || !this.motionSensor) return;
		this.gyroscopeRequested = true;

		const granted = await this.motionSensor.requestPermission();
		if (granted) {
			this.pointerSensor.stop();
			this.motionSensor.start();
		}
	};

	enable(): void {
		if (this.destroyed) return;
		this.options.disabled = false;
		this.pointerSensor.start();
	}

	disable(): void {
		this.options.disabled = true;
		this.pointerSensor.stop();
		this.motionSensor?.stop();
		this.resetTransform();
	}

	async requestPermission(): Promise<boolean> {
		if (!this.motionSensor) return false;
		const granted = await this.motionSensor.requestPermission();
		if (granted) {
			this.pointerSensor.stop();
			this.motionSensor.start();
		}
		return granted;
	}

	destroy(): void {
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

		this.el.removeEventListener("touchstart", this.handleFirstTouch);
	}

	on<K extends keyof LevitaEventMap>(event: K, callback: EventCallback<LevitaEventMap[K]>): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)?.add(callback as EventCallback<unknown>);
	}

	off<K extends keyof LevitaEventMap>(event: K, callback: EventCallback<LevitaEventMap[K]>): void {
		this.listeners.get(event)?.delete(callback as EventCallback<unknown>);
	}

	private emit<K extends keyof LevitaEventMap>(event: K, data: LevitaEventMap[K]): void {
		const callbacks = this.listeners.get(event);
		if (callbacks) {
			for (const cb of callbacks) {
				cb(data);
			}
		}
	}

	private handleSensorInput(input: SensorOutput): void {
		if (this.options.disabled) return;

		const multiplier = this.options.reverse ? -1 : 1;
		const x = input.y * this.options.max * multiplier;
		const y = input.x * this.options.max * multiplier * -1;

		this.el.style.setProperty("--levita-x", `${x}deg`);
		this.el.style.setProperty("--levita-y", `${y}deg`);
		this.el.style.setProperty("--levita-scale", String(this.options.scale));

		this.glareEffect?.update(input.x, input.y);
		this.shadowEffect?.update(input.x, input.y);

		const values: TiltValues = {
			x,
			y,
			percentX: input.x,
			percentY: input.y,
		};
		this.emit("move", values);
	}

	private handleEnter(): void {
		this.el.style.setProperty("--levita-scale", String(this.options.scale));
		this.emit("enter", undefined);
	}

	private handleLeave(): void {
		if (this.options.reset) {
			this.resetTransform();
		}
		this.emit("leave", undefined);
	}

	private resetTransform(): void {
		this.el.style.setProperty("--levita-x", "0deg");
		this.el.style.setProperty("--levita-y", "0deg");
		this.el.style.setProperty("--levita-scale", "1");
		this.glareEffect?.update(0, 0);
		this.shadowEffect?.update(0, 0);
	}

	private applyBaseProperties(): void {
		this.el.style.setProperty("--levita-perspective", `${this.options.perspective}px`);
		this.el.style.setProperty("--levita-speed", `${this.options.speed}ms`);
		this.el.style.setProperty("--levita-easing", this.options.easing);
	}

	private removeBaseProperties(): void {
		this.el.style.removeProperty("--levita-perspective");
		this.el.style.removeProperty("--levita-speed");
		this.el.style.removeProperty("--levita-easing");
		this.el.style.removeProperty("--levita-x");
		this.el.style.removeProperty("--levita-y");
		this.el.style.removeProperty("--levita-scale");
	}
}
