<!-- markdownlint-disable MD033 MD041 -->

<p align="center">
  <a href="https://github.com/jeromearsene/levita">
    <img src="docs/banner.png" alt="Levita — Lightweight 3D tilt & parallax library with accelerometer support" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/jeromearsene/levita/actions/workflows/ci.yml"><img src="https://github.com/jeromearsene/levita/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/levita"><img src="https://img.shields.io/npm/v/levita" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/levita"><img src="https://img.shields.io/npm/dm/levita" alt="npm downloads" /></a>
  <a href="https://github.com/jeromearsene/levita/actions/workflows/ci.yml"><img src="https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size.json" alt="bundle size" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/jeromearsene/levita" alt="license" /></a>
</p>

- **CSS-driven** — No `requestAnimationFrame` loop. CSS custom properties + compositor = GPU-accelerated.
- **~5KB gzipped** — Core engine only.
- **Accelerometer** — Auto-detects gyroscope, handles iOS permissions transparently.
- **Multi-layer parallax** — `data-levita-offset` on children for depth layering.
- **React, Vue & Svelte** — First-class wrappers with identical API.

## Effects

| Tilt | Glare |
|:----:|:-----:|
| ![Tilt](docs/animations/tilt.gif) | ![Glare](docs/animations/glare.gif) |
| **Shadow** | **Combined** |
| ![Shadow](docs/animations/shadow.gif) | ![Combined](docs/animations/combined.gif) |

## Install

```bash
# Core (vanilla JS/TS)
npm install levita

# React wrapper
npm install @levita/react

# Vue wrapper
npm install @levita/vue

# Svelte wrapper
npm install @levita/svelte
```

## Quick Start

### Vanilla

```typescript
import { Levita } from "levita";
import "levita/style.css";

new Levita(document.getElementById("card"), {
  glare: true,
  shadow: true,
});
```

### React

```tsx
import { Tilt } from "@levita/react";
import "levita/style.css";

function Card() {
  return (
    <Tilt glare shadow>
      <h2>Hello</h2>
    </Tilt>
  );
}
```

### Vue

```vue
<script setup>
import { Tilt } from "@levita/vue";
import "levita/style.css";
</script>

<template>
  <Tilt glare shadow>
    <h2>Hello</h2>
  </Tilt>
</template>
```

### Svelte

```svelte
<script>
  import { tilt } from "@levita/svelte";
  import "levita/style.css";
</script>

<div use:tilt={{ glare: true, shadow: true }}>
  <h2>Hello</h2>
</div>
```

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

| Option        | Type                 | Default      | Description               |
| ------------- | -------------------- | ------------ | ------------------------- |
| `max`         | `number`             | `15`         | Max tilt angle in degrees |
| `perspective` | `number`             | `1000`       | CSS perspective in px     |
| `scale`       | `number`             | `1.05`       | Scale factor on hover     |
| `speed`       | `number`             | `400`        | Transition duration in ms |
| `easing`      | `string`             | `'ease-out'` | CSS easing function       |
| `reverse`     | `boolean`            | `false`      | Invert tilt direction     |
| `axis`        | `'x' \| 'y' \| null` | `null`       | Lock to single axis       |
| `reset`       | `boolean`            | `true`       | Reset on pointer leave    |
| `glare`       | `boolean`            | `false`      | Enable glare effect       |
| `maxGlare`    | `number`             | `0.5`        | Max glare opacity (0-1)   |
| `shadow`      | `boolean`            | `false`      | Enable dynamic shadow     |
| `gyroscope`   | `'auto' \| boolean`  | `'auto'`     | Accelerometer mode        |
| `disabled`    | `boolean`            | `false`      | Disable the effect        |

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

| Feature              | Levita           | Atropos          | vanilla-tilt    |
| -------------------- | ---------------- | ---------------- | --------------- |
| Bundle size (gzip)   | ~5KB             | ~2KB             | ~3-4KB          |
| Animation            | CSS custom props | CSS transitions  | rAF loop        |
| Tree-shakeable       | Yes              | No               | No              |
| Multi-layer parallax | Yes (data attrs) | Yes (data attrs) | No (manual)     |
| Accelerometer        | Auto + manual    | No               | Partial (buggy) |
| React                | Official         | Official         | Community       |
| Vue                  | Official         | Web Component    | Community       |
| Svelte               | Official         | No               | No              |
| TypeScript           | Native           | Yes              | Types only      |

## Bundle Size

Measured with [size-limit](https://github.com/ai/size-limit) (tree-shaken, gzipped):

| Package | Size (gzip) |
| ------- | ----------- |
| `levita` (core) | ![core size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size-levita--core-.json) |
| `@levita/react` | ![react size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size--levita-react.json) |
| `@levita/vue` | ![vue size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size--levita-vue.json) |
| `@levita/svelte` | ![svelte size](https://img.shields.io/endpoint?url=https://jeromearsene.github.io/levita/badge-size--levita-svelte.json) |

> Sizes are automatically measured on each push to `main`.

## Benchmarks

Measured with [Vitest bench](https://vitest.dev/guide/features.html#benchmarking) (happy-dom):

| Scenario                          | ops/s   |
| --------------------------------- | ------- |
| Basic init + destroy              | ~29,000 |
| Init with glare + shadow          | ~16,000 |
| Init with 5 parallax layers       | ~10,500 |
| Pointer move update               | ~15,500 |
| Pointer move with glare + shadow  | ~8,400  |

Run locally: `pnpm bench`

## Development

```bash
# Prerequisites: Volta (manages Node + pnpm versions)
# Install: https://volta.sh

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run benchmarks
pnpm bench

# Lint
pnpm lint

# Demo dev server
pnpm --filter levita-demo dev
```

## Sponsors

If you find Levita useful, consider supporting its development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jeromearsene)
[![GitHub Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/jeromearsene)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jeromearsene/levita&type=Date)](https://star-history.com/#jeromearsene/levita&Date)

## License

MIT
