import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { FRAMEWORKS, type Framework } from "../constants";

interface CodeTabsProps {
	snippets: Record<Framework, string>;
	collapsed?: boolean;
	defaultFramework?: Framework;
	onFrameworkChange?: (framework: Framework) => void;
	children?: ComponentChildren;
}

/**
 * Reusable component that displays code snippets with framework tabs.
 * Supports an optional collapsed mode with a "View code" / "Hide code" toggle.
 */
export function CodeTabs({
	snippets,
	collapsed = false,
	defaultFramework = "vanilla",
	onFrameworkChange,
	children,
}: CodeTabsProps) {
	const [currentFramework, setCurrentFramework] = useState<Framework>(defaultFramework);
	const [isOpen, setIsOpen] = useState(!collapsed);
	const [copyStatus, setCopyStatus] = useState(false);

	const snippet = snippets[currentFramework];

	const handleFrameworkChange = (framework: Framework) => {
		setCurrentFramework(framework);
		onFrameworkChange?.(framework);
	};

	const copyCode = () => {
		navigator.clipboard.writeText(snippet);
		setCopyStatus(true);
		setTimeout(() => setCopyStatus(false), 2000);
	};

	const toggle = () => setIsOpen((prev) => !prev);

	return (
		<div class="flex flex-col gap-2 mt-4 text-left">
			{collapsed && (
				<button
					type="button"
					class="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition w-fit"
					onClick={toggle}
				>
					<svg
						class={`transition-transform ${isOpen ? "rotate-90" : ""}`}
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<title>Toggle</title>
						<polyline points="9 18 15 12 9 6" />
					</svg>
					{isOpen ? "Hide code" : "View code"}
				</button>
			)}

			{isOpen && (
				<>
					<div class="flex gap-2 p-1 bg-surface border border-border rounded-lg overflow-x-auto no-scrollbar">
						{FRAMEWORKS.map((framework) => (
							<button
								key={framework}
								type="button"
								class={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${currentFramework === framework ? "bg-accent text-gray-900" : "text-text-secondary hover:text-text"}`}
								onClick={() => handleFrameworkChange(framework)}
							>
								{framework.charAt(0).toUpperCase() + framework.slice(1)}
							</button>
						))}
					</div>

					<div class="relative group">
						<pre class="bg-[#1f2937] border border-[rgba(255,255,255,0.08)] rounded-xl px-5 py-4 font-mono text-sm text-[#a3e635] leading-relaxed overflow-x-auto min-h-[160px]">
							<code>{snippet}</code>
						</pre>
						<div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<button
								type="button"
								onClick={copyCode}
								class="p-2 rounded-lg bg-[#1f2937] border border-[rgba(255,255,255,0.1)] text-[#9ca3af] hover:text-white hover:bg-[rgba(255,255,255,0.1)] hover:border-accent transition shadow-xl"
								title="Copy code"
							>
								{copyStatus ? (
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="#2dd4bf"
										stroke-width="2"
									>
										<title>Success</title>
										<polyline points="20 6 9 17 4 12" />
									</svg>
								) : (
									<svg
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<title>Copy</title>
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
										<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
									</svg>
								)}
							</button>
							{children}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
