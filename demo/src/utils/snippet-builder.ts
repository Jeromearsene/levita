import type { Framework } from "../constants";

interface SnippetConfig {
	/** React-style JSX props, e.g. ["max={15}", "reverse", 'gyroscope="auto"'] */
	props: string[];
	/** Vanilla JS entries, e.g. ['  max: 15', '  reverse: true'] */
	entries: string[];
	/** Children/content for each framework template (defaults provided) */
	children?: {
		react?: string;
		vue?: string;
		svelte?: string;
		angular?: string;
	};
	/** Optional CSS class on the Svelte/Angular wrapper div */
	wrapperClass?: string;
}

/**
 * Convert a React-style prop to object notation.
 * "max={15}" → "max: 15"
 * 'gyroscope="auto"' → "gyroscope: 'auto'"
 * "reverse" → "reverse: true"
 */
function toObjectNotation(prop: string): string {
	if (prop.includes("={")) return prop.replace(/=\{(.+?)\}/, ": $1");
	if (prop.includes('="')) return prop.replace(/="(.+?)"/, ": '$1'");
	return `${prop}: true`;
}

/**
 * Convert a React-style prop to Vue template syntax.
 * "max={15}" → ':max="15"'
 * 'gyroscope="auto"' → stays as-is
 * "reverse" → stays as-is
 */
function toVueProp(prop: string): string {
	if (prop.includes("={")) return `:${prop.replace(/=\{(.+?)\}/, '="$1"')}`;
	return prop;
}

/**
 * Build code snippets for all frameworks from React-style props and vanilla entries.
 */
export function buildAllSnippets(config: SnippetConfig): Record<Framework, string> {
	const { props, entries, children = {}, wrapperClass } = config;

	const reactChildren = children.react ?? "{/* content */}";
	const vueChildren = children.vue ?? "<!-- content -->";
	const svelteChildren = children.svelte ?? "<!-- content -->";
	const angularChildren = children.angular ?? "<!-- content -->";

	const propsString = props.length > 0 ? ` ${props.join(" ")}` : "";
	const vuePropsString = props.length > 0 ? ` ${props.map(toVueProp).join(" ")}` : "";
	const objectOptions = props.map(toObjectNotation).join(", ");
	const cls = wrapperClass ? ` class="${wrapperClass}"` : "";

	const react = `<Tilt${propsString}>\n  ${reactChildren}\n</Tilt>`;
	const vue = `<Tilt${vuePropsString}>\n  ${vueChildren}\n</Tilt>`;

	const svelte = objectOptions
		? `<div use:tilt={{ ${objectOptions} }}${cls}>\n  ${svelteChildren}\n</div>`
		: `<div use:tilt${cls}>\n  ${svelteChildren}\n</div>`;

	const angular = objectOptions
		? `<div [levita]="{ ${objectOptions} }"${cls}>\n  ${angularChildren}\n</div>`
		: `<div levita${cls}>\n  ${angularChildren}\n</div>`;

	const vanilla =
		entries.length === 0 ? "new Levita(el);" : `new Levita(el, {\n${entries.join(",\n")},\n});`;

	return { vanilla, react, vue, svelte, angular };
}
