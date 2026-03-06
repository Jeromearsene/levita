<!-- markdownlint-disable MD033 MD041 -->

<p align="center">
  <a href="https://github.com/jeromearsene/levita" target="_blank" rel="noopener noreferrer">
    <img src="docs/banner.webp" alt="Levita — Lightweight 3D tilt & parallax library with accelerometer support" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/jeromearsene/levita/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer"><img src="https://github.com/jeromearsene/levita/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/levita-js" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/levita-js" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/levita-js" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dm/levita-js" alt="npm downloads" /></a>
  <a href="https://github.com/jeromearsene/levita/actions/workflows/ci.yml" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fjeromearsene.github.io%2Flevita%2Fbadge-size.json" alt="bundle size" /></a>
  <a href="https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/vanilla" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white" alt="StackBlitz" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/jeromearsene/levita" alt="license" /></a>
  <a href="https://jeromearsene.github.io/levita/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/demo-live-blueviolet" alt="demo" /></a>
</p>

- **CSS-driven** — No `requestAnimationFrame` loop. CSS custom properties + compositor = GPU-accelerated.
- **~2KB gzipped** — Core engine only.
- **Accelerometer** — Auto-detects gyroscope, handles iOS permissions transparently.
- **Multi-layer parallax** — `data-levita-offset` on children for depth layering.
- **Framework first** — Official, lightweight wrappers for React, Vue, Svelte & Angular. [See examples](https://jeromearsene.github.io/levita/#playground).
- **Styling agnostic** — Works with any CSS framework (Tailwind, Bootstrap, etc.) or vanilla CSS. [See examples](https://jeromearsene.github.io/levita/#styling).

## Table of Contents

- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg" width="16" height="16" valign="middle" alt="Ecosystem"> [Ecosystem](#ecosystem)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg" width="16" height="16" valign="middle" alt="Effects"> [Effects](#effects)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/download.svg" width="16" height="16" valign="middle" alt="Install"> [Install](#install)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/rocket.svg" width="16" height="16" valign="middle" alt="Quick Start"> [Quick Start](#quick-start)
  - [Vanilla](#vanilla)
  - [React](#react)
  - [Vue](#vue)
  - [Svelte](#svelte)
  - [Angular](#angular)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/component.svg" width="16" height="16" valign="middle" alt="Parallax Layers"> [Parallax Layers](#parallax-layers)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layout-grid.svg" width="16" height="16" valign="middle" alt="Grouped Instances"> [Grouped Instances](#grouped-instances)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/smartphone.svg" width="16" height="16" valign="middle" alt="Accelerometer"> [Accelerometer](#accelerometer)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/settings-2.svg" width="16" height="16" valign="middle" alt="Options"> [Options](#options)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg" width="16" height="16" valign="middle" alt="Events"> [Events](#events)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/box.svg" width="16" height="16" valign="middle" alt="Methods"> [Methods](#methods)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/cpu.svg" width="16" height="16" valign="middle" alt="How It Works"> [How It Works](#how-it-works)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/scale.svg" width="16" height="16" valign="middle" alt="Comparison"> [Comparison](#comparison)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gauge.svg" width="16" height="16" valign="middle" alt="Benchmarks"> [Benchmarks](#benchmarks)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/heart.svg" width="16" height="16" valign="middle" alt="Contributing"> [Contributing](#contributing)
- <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" width="16" height="16" valign="middle" alt="License"> [License](#license)

## Ecosystem

Levita is designed to be framework-agnostic. Choose your flavor:

| Framework | Min Version | Size (gzip) | Playground |
| :--- | :--- | :--- | :--- |
| <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/file-code.svg" width="18" height="18" valign="middle" alt="Vanilla JS"> **[Vanilla JS](#vanilla)** | **-** | ![core size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-levita-js.json) | [![Try Vanilla JS on StackBlitz](https://img.shields.io/badge/StackBlitz-Try_it-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/vanilla) |
| <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/atom.svg" width="18" height="18" valign="middle" alt="React"> **[React](#react)** | ![react min version](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-version-react.json) | ![react size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-react.json) | [![Try React on StackBlitz](https://img.shields.io/badge/StackBlitz-Try_it-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/react) |
| <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg" width="18" height="18" valign="middle" alt="Vue"> **[Vue](#vue)** | ![vue min version](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-version-vue.json) | ![vue size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-vue.json) | [![Try Vue on StackBlitz](https://img.shields.io/badge/StackBlitz-Try_it-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/vue) |
| <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/zap.svg" width="18" height="18" valign="middle" alt="Svelte"> **[Svelte](#svelte)** | ![svelte min version](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-version-svelte.json) | ![svelte size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-svelte.json) | [![Try Svelte on StackBlitz](https://img.shields.io/badge/StackBlitz-Try_it-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/svelte) |
| <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/box.svg" width="18" height="18" valign="middle" alt="Angular"> **[Angular](#angular)** | ![angular min version](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-version-angular.json) | ![angular size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-angular.json) | [![Try Angular on StackBlitz](https://img.shields.io/badge/StackBlitz-Try_it-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/angular) |

## Effects

| Tilt | Glare |
| :---: | :---: |
| ![Tilt](docs/animations/tilt.gif) | ![Glare](docs/animations/glare.gif) |
| **Shadow** | **Combined** |
| ![Shadow](docs/animations/shadow.gif) | ![Combined](docs/animations/combined.gif) |

## Install

```bash
# Core (vanilla JS/TS)
npm install levita-js

# React wrapper
npm install @levita-js/react

# Vue wrapper
npm install @levita-js/vue

# Svelte wrapper
npm install @levita-js/svelte

# Angular wrapper
npm install @levita-js/angular
```

## Quick Start

<a name="vanilla"></a>

### Vanilla

```typescript
import { Levita } from "levita-js";
import "levita-js/style.css";

new Levita(document.getElementById("card"), {
  glare: true,
  shadow: true,
});
```

[![Open Vanilla JS example in StackBlitz](https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/vanilla)

<a name="react"></a>

### React

```tsx
import { Tilt } from "@levita-js/react";
import "levita-js/style.css";

function Card() {
  return (
    <Tilt glare shadow>
      <h2>Hello</h2>
    </Tilt>
  );
}
```

[![Open React example in StackBlitz](https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/react)

<a name="vue"></a>

### Vue

```vue
<script setup>
import { Tilt } from "@levita-js/vue";
import "levita-js/style.css";
</script>

<template>
  <Tilt glare shadow>
    <h2>Hello</h2>
  </Tilt>
</template>
```

[![Open Vue example in StackBlitz](https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/vue)

<a name="svelte"></a>

### Svelte

```svelte
<script>
  import { tilt } from "@levita-js/svelte";
  import "levita-js/style.css";
</script>

<div use:tilt={{ glare: true, shadow: true }}>
  <h2>Hello</h2>
</div>
```

[![Open Svelte example in StackBlitz](https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/svelte)

<a name="angular"></a>

### Angular

```typescript
import { LevitaDirective } from "@levita-js/angular";
import "levita-js/style.css";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [LevitaDirective],
  template: `
    <div [levita]="{ glare: true, shadow: true }">
      <h2>Hello</h2>
    </div>
  `,
})
export class CardComponent {}
```

[![Open Angular example in StackBlitz](https://img.shields.io/badge/StackBlitz-Open_Project-1374ef?logo=stackblitz&logoColor=white)](https://stackblitz.com/github/jeromearsene/levita/tree/main/examples/angular)

## Parallax Layers

Add `data-levita-offset` to children for multi-depth parallax. Positive values come forward, negative go back:

```html
<div id="scene">
  <img data-levita-offset="-5" src="bg.png" />
  <img data-levita-offset="0" src="mid.png" />
  <img data-levita-offset="10" src="fg.png" />
</div>
```

```typescript
new Levita(document.getElementById("scene"));
```

## Grouped Instances

You can make multiple Levita instances react to the same pointer movement by using the `eventsEl` option. This is useful for grids where all cards should tilt together:

```typescript
const container = document.getElementById("grid-container");
const cards = document.querySelectorAll(".card");

for (const card of cards) {
  new Levita(card, { eventsEl: container });
}
```

## Accelerometer

Levita auto-detects accelerometer support:

- **Android** — works immediately, no permission needed.
- **iOS 13+** — permission requested on first touch (silent fallback if denied).

```typescript
// Auto mode (default) — handles everything
new Levita(el, { gyroscope: "auto" });

// Manual mode — you control when to ask
const instance = new Levita(el, { gyroscope: true });
button.addEventListener("click", async () => {
  const granted = await instance.requestPermission();
  console.log("Gyroscope:", granted ? "enabled" : "denied");
});

// Disabled
new Levita(el, { gyroscope: false });
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | `15` | Max tilt angle in degrees |
| `perspective` | `number` | `1000` | CSS perspective in px |
| `scale` | `number` | `1.05` | Scale factor on hover |
| `speed` | `number` | `200` | Transition duration in ms |
| `easing` | `string` | `'ease-out'` | CSS easing function |
| `reverse` | `boolean` | `false` | Invert tilt direction |
| `axis` | `'x' \| 'y' \| null` | `null` | Lock to single axis |
| `reset` | `boolean` | `true` | Reset on pointer leave |
| `glare` | `boolean` | `false` | Enable glare effect |
| `maxGlare` | `number` | `0.5` | Max glare opacity (0-1) |
| `shadow` | `boolean` | `false` | Enable dynamic shadow |
| `gyroscope` | `'auto' \| boolean` | `'auto'` | Accelerometer mode |
| `disabled` | `boolean` | `false` | Disable the effect |
| `eventsEl` | `HTMLElement \| null` | `null` | Element to listen for events on |

## Events

```typescript
const instance = new Levita(el);

instance.on("move", ({ x, y, percentX, percentY }) => {
  console.log(`Tilt: ${x}°, ${y}°`);
});

instance.on("enter", () => console.log("Pointer entered"));
instance.on("leave", () => console.log("Pointer left"));

// Remove listener
instance.off("move", handler);
```

## Methods

```typescript
instance.enable(); // Re-enable after disable
instance.disable(); // Pause and reset
instance.destroy(); // Full cleanup
await instance.requestPermission(); // Manual gyroscope permission
```

## How It Works

Unlike vanilla-tilt (which runs a `requestAnimationFrame` loop), Levita uses **CSS custom properties**:

1. JS calculates tilt angle from input (pointer or accelerometer)
2. Sets `--levita-x` and `--levita-y` on the element
3. CSS `transform` and `transition` handle the rest on the **GPU compositor thread**

This means:

- No JS running between frames
- Browser optimizes the animation path
- Lower CPU usage, smoother results

## Comparison

| Feature | **Levita** | Atropos | vanilla-tilt |
| --- | --- | --- | --- |
| Bundle size (gzip) | **~2KB** | ~2KB | ~3-4KB |
| Animation | **CSS custom props** | CSS transitions | rAF loop |
| Tree-shakeable | **✅** | ❌ | ❌ |
| Multi-layer parallax | **✅ (data attrs)** | ✅ (data attrs) | ❌ (manual) |
| Accelerometer | **Auto + manual** | ❌ | Partial (buggy) |
| React | **Official** | Official | Community |
| Vue | **Official** | Web Component | Community |
| Svelte | **Official** | ❌ | ❌ |
| Angular | **Official** | Web Component | Community |
| TypeScript | **Native** | Built-in types | External types |
| Maintained | **✅** | ❌ | ❌ |

## Benchmarks

Measured with [Vitest bench](https://vitest.dev/guide/features.html#benchmarking) (happy-dom):

| Scenario | ops/s |
| --- | --- |
| Basic init + destroy | ![bench](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-bench-levita-basic-init.json) |
| Init with glare + shadow | ![bench](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-bench-levita-init-with-glare-shadow.json) |
| Init with 5 parallax layers | ![bench](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-bench-levita-init-with-5-layers.json) |
| Pointer move update | ![bench](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-bench-levita-pointer-move-update.json) |
| Pointer move with glare + shadow | ![bench](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-bench-levita-pointer-move-with-glare-shadow.json) |

Run locally: `pnpm bench`

> Automatically updated at each release.

## Contributing

Levita is a monorepo managed with pnpm. For details on how to set up the development environment, run tests, and understand our release workflow, check out our [Development Guide](./DEVELOPMENT.md).

## Sponsors

If you find Levita useful, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jeromearsene)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/jeromearsene)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jeromearsene/levita&type=Date)](https://star-history.com/#jeromearsene/levita&Date)

## License

MIT
