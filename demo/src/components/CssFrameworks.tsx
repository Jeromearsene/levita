import type { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";
import { Tilt } from "./Tilt";

/**
 * Interface representing a CSS framework example.
 */
interface CssExample {
	id: string;
	name: string;
	code: string;
	render: () => JSX.Element;
}

/**
 * Helper to wrap HTML in Levita initialization code for display.
 */
const wrapCode = (html: string) => `import { Levita } from "levita-js";

const el = document.querySelector(".card");
new Levita(el, {
  glare: true,
  shadow: true
});

// Markup:
${html}`;

/**
 * Section demonstrating that Levita is agnostic to styling solutions.
 * It showcases the library working with various popular CSS frameworks.
 */
export function CssFrameworks() {
	const [activeTab, setActiveTab] = useState("vanilla");

	/** Stable reference for tilt options to avoid unnecessary re-initializations. */
	const tiltOptions = useMemo(() => ({ glare: true, shadow: true }), []);

	const frameworks: CssExample[] = [
		{
			id: "vanilla",
			name: "Vanilla CSS",
			code: wrapCode(`<style>
  .card {
    width: 256px; height: 320px; padding: 24px;
    background: #1e293b; border-radius: 16px;
    color: white; border: 1px solid #334155;
  }
  .inner {
    height: 120px; background: #38bdf8;
    border-radius: 8px; margin-bottom: 16px;
  }
</style>

<div class="card">
  <div class="inner" data-levita-offset="30"></div>
  <h3 data-levita-offset="50">Vanilla CSS</h3>
</div>`),
			render: () => (
				<div
					class="text-left"
					style={{
						width: "256px",
						height: "320px",
						padding: "24px",
						background: "#1e293b",
						borderRadius: "16px",
						color: "white",
						border: "1px solid #334155",
					}}
				>
					<div
						style={{
							height: "128px",
							background: "#38bdf8",
							borderRadius: "8px",
							marginBottom: "16px",
						}}
						data-levita-offset="30"
					></div>
					<h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }} data-levita-offset="50">
						Vanilla CSS
					</h3>
				</div>
			),
		},
		{
			id: "tailwind",
			name: "Tailwind CSS",
			code: wrapCode(`<div class="card w-64 h-80 rounded-xl bg-white shadow-lg p-6 flex flex-col justify-between">
  <div class="h-32 bg-indigo-500 rounded-lg" data-levita-offset="20"></div>
  <h3 class="text-xl font-bold text-slate-800" data-levita-offset="40">Tailwind Card</h3>
  <button class="w-full py-2 bg-slate-900 text-white rounded-md text-sm font-medium">Action</button>
</div>`),
			render: () => (
				<div class="w-64 h-80 rounded-xl bg-white shadow-lg p-6 flex flex-col justify-between border border-white/10 text-left">
					<div class="h-32 bg-indigo-500 rounded-lg" data-levita-offset="20"></div>
					<h3 class="text-xl font-bold text-slate-800" data-levita-offset="40">
						Tailwind Card
					</h3>
					<button
						type="button"
						class="w-full py-2 bg-slate-900 text-white rounded-md text-sm font-medium pointer-events-none"
					>
						Action
					</button>
				</div>
			),
		},
		{
			id: "bootstrap",
			name: "Bootstrap",
			code: wrapCode(`<div class="card border-0 shadow-sm" style="width: 16rem;">
  <div class="card-body text-start">
    <div class="bg-primary rounded mb-3" style="height: 100px;" data-levita-offset="25"></div>
    <h5 class="card-title" data-levita-offset="45">Bootstrap Card</h5>
    <p class="card-text text-muted small">Built with standard Bootstrap classes.</p>
    <a href="#" class="btn btn-primary btn-sm">Explore</a>
  </div>
</div>`),
			render: () => (
				<div class="w-64 h-80 bg-white rounded-lg shadow-md p-0 flex flex-col overflow-hidden text-left">
					<div class="p-4 flex flex-col h-full">
						<div class="bg-blue-600 rounded mb-3 h-24 w-full" data-levita-offset="25"></div>
						<h5 class="text-slate-900 font-bold text-lg mb-2" data-levita-offset="45">
							Bootstrap Card
						</h5>
						<p class="text-slate-500 text-xs mb-4">Built with standard Bootstrap classes.</p>
						<div class="mt-auto">
							<span class="inline-block px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">
								Explore
							</span>
						</div>
					</div>
				</div>
			),
		},
		{
			id: "semantic",
			name: "Semantic UI",
			code: wrapCode(`<div class="ui card">
  <div class="image">
    <div class="ui placeholder segment h-32" data-levita-offset="20"></div>
  </div>
  <div class="content text-start">
    <button class="header" data-levita-offset="40">Semantic UI</button>
    <div class="meta"><span>Library</span></div>
  </div>
</div>`),
			render: () => (
				<div class="w-64 h-80 bg-white rounded border border-slate-200 shadow-sm overflow-hidden text-left">
					<div class="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-200">
						<div class="w-48 h-24 bg-slate-200 rounded" data-levita-offset="20"></div>
					</div>
					<div class="p-4">
						<button
							type="button"
							class="text-slate-900 font-bold text-lg cursor-pointer text-left"
							data-levita-offset="40"
						>
							Semantic UI
						</button>
						<p class="text-slate-400 text-sm mt-1">Library Example</p>
					</div>
				</div>
			),
		},
		{
			id: "flowbite",
			name: "Flowbite",
			code: wrapCode(`<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-left">
    <div class="w-10 h-10 mb-3 text-gray-500" data-levita-offset="30">
        <svg fill="currentColor" viewBox="0 0 20 20">...</svg>
    </div>
    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white" data-levita-offset="50">Need help?</h5>
    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Flowbite component style.</p>
</div>`),
			render: () => (
				<div class="w-64 h-80 p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex flex-col text-left">
					<div
						class="w-12 h-12 mb-4 text-slate-400 bg-slate-700 rounded-lg flex items-center justify-center"
						data-levita-offset="30"
					>
						<svg
							class="w-6 h-6"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Help Icon</title>
							<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.121 17.243L16.121 17.243a1 1 0 01-1.414 0l-.707-.707a1 1 0 111.414-1.414l.707.707a1 1 0 010 1.414zM4.929 16.364l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414z"></path>
						</svg>
					</div>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-white" data-levita-offset="50">
						Need help?
					</h5>
					<p class="font-normal text-slate-400 text-sm">Flowbite component style.</p>
				</div>
			),
		},
		{
			id: "bulma",
			name: "Bulma",
			code: wrapCode(`<div class="box text-start">
  <article class="media">
    <div class="media-content">
      <div class="content">
        <p data-levita-offset="20">
          <strong>Bulma CSS</strong> <small>@bulma</small>
          <br>
          Leveraging the modern flexbox-based framework.
        </p>
      </div>
    </div>
  </article>
</div>`),
			render: () => (
				<div class="w-64 h-80 bg-white rounded-md shadow p-6 flex flex-col border border-slate-200 text-left">
					<div class="flex gap-4">
						<div class="w-12 h-12 rounded bg-teal-500 shrink-0" data-levita-offset="30"></div>
						<div class="flex flex-col gap-1">
							<div class="h-4 w-24 bg-slate-200 rounded" data-levita-offset="10"></div>
							<div class="h-3 w-16 bg-slate-100 rounded" data-levita-offset="10"></div>
						</div>
					</div>
					<div class="mt-6 flex flex-col gap-3">
						<div class="h-3 w-full bg-slate-100 rounded" data-levita-offset="20"></div>
						<div class="h-3 w-full bg-slate-100 rounded" data-levita-offset="20"></div>
						<div class="h-3 w-2/3 bg-slate-100 rounded" data-levita-offset="20"></div>
					</div>
					<div class="mt-auto h-10 w-full border-t border-slate-100 flex items-center pt-2">
						<p class="text-teal-500 font-bold text-xs">@bulma</p>
					</div>
				</div>
			),
		},
	];

	const currentFramework = frameworks.find((f) => f.id === activeTab) || frameworks[0];

	if (!currentFramework) return null;

	return (
		<section id="styling" class="max-w-5xl mx-auto px-16 sm:px-8 py-16">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-2">Styling Agnostic</h2>
				<p class="text-text-secondary">
					Levita only cares about data attributes. Use it with any CSS solution.
				</p>
			</div>

			<div class="flex flex-col gap-8">
				<div class="flex flex-wrap justify-center gap-2 p-1 bg-surface border border-border rounded-xl">
					{frameworks.map((f) => (
						<button
							key={f.id}
							type="button"
							class={`px-4 py-2 text-sm font-semibold rounded-lg transition ${activeTab === f.id ? "bg-accent text-bg" : "text-text-secondary hover:text-text"}`}
							onClick={() => setActiveTab(f.id)}
						>
							{f.name}
						</button>
					))}
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
					<div class="flex justify-center py-10 bg-surface/30 rounded-3xl border border-dashed border-border">
						<Tilt key={activeTab} options={tiltOptions} class="rounded-2xl cursor-pointer">
							{currentFramework.render()}
						</Tilt>
					</div>

					<div class="relative group">
						<div class="absolute -top-3 left-4 px-2 py-0.5 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest rounded">
							{currentFramework.name} Code
						</div>
						<pre class="bg-surface border border-border rounded-xl px-5 py-6 font-mono text-sm text-accent leading-relaxed overflow-x-auto min-h-[200px]">
							<code>{currentFramework.code}</code>
						</pre>
					</div>
				</div>
			</div>
		</section>
	);
}
