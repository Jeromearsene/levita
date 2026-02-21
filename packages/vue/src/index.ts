import type { Axis, GyroscopeMode } from "levita";
import { buildOptions, Levita, OPTION_KEYS } from "levita";
import {
	defineComponent,
	h,
	onMounted,
	onUnmounted,
	type PropType,
	ref,
	type SlotsType,
	watch,
} from "vue";

/**
 * Vue 3 wrapper for the Levita 3D tilt effect.
 *
 * Accepts all `LevitaOptions` as props. The Levita instance is created
 * on mount and destroyed on unmount. Changing any tilt prop recreates
 * the instance.
 *
 * Exposes `element`, `instance`, and `requestPermission()` via template ref.
 *
 * @example
 * ```vue
 * <script setup>
 * import { Tilt } from '@levita/vue';
 * import 'levita/style.css';
 * </script>
 *
 * <template>
 *   <Tilt :glare="true" :shadow="true" :max="20">
 *     <h1>Hello</h1>
 *   </Tilt>
 * </template>
 * ```
 */
export const Tilt = defineComponent({
	name: "Tilt",

	props: {
		max: { type: Number, default: undefined },
		perspective: { type: Number, default: undefined },
		scale: { type: Number, default: undefined },
		speed: { type: Number, default: undefined },
		easing: { type: String, default: undefined },
		reverse: { type: Boolean, default: undefined },
		axis: { type: String as PropType<Axis>, default: undefined },
		reset: { type: Boolean, default: undefined },
		glare: { type: Boolean, default: undefined },
		maxGlare: { type: Number, default: undefined },
		shadow: { type: Boolean, default: undefined },
		gyroscope: {
			type: [String, Boolean] as PropType<GyroscopeMode>,
			default: undefined,
		},
		disabled: { type: Boolean, default: undefined },
	},

	slots: Object as SlotsType<{ default: Record<string, never> }>,

	setup(props, { slots, expose }) {
		const elRef = ref<HTMLElement | null>(null);
		let instance: Levita | null = null;

		/** Create a fresh Levita instance on the container element. */
		const init = () => {
			if (!elRef.value) return;
			instance?.destroy();
			instance = new Levita(elRef.value, buildOptions(props));
		};

		/** Request accelerometer permission (must be called from a user gesture on iOS). */
		const requestPermission = async (): Promise<boolean> => {
			return (await instance?.requestPermission()) ?? false;
		};

		expose({
			/** The underlying DOM element. */
			get element() {
				return elRef.value;
			},
			/** The Levita instance driving the tilt effect. */
			get instance() {
				return instance;
			},
			requestPermission,
		});

		onMounted(init);

		onUnmounted(() => {
			instance?.destroy();
			instance = null;
		});

		watch(
			() => OPTION_KEYS.map((k) => props[k]),
			() => init(),
		);

		return () => h("div", { ref: elRef }, slots.default?.({}));
	},
});
