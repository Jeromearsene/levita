# levita-js

> Lightweight 3D tilt & parallax effect for the modern web with accelerometer support.

Core engine for Levita. No dependencies, GPU-accelerated, and highly performant.

## Installation

```bash
npm install levita-js
```

## Quick Start

```typescript
import { Levita } from "levita-js";
import "levita-js/style.css";

const card = document.getElementById("card");
new Levita(card, {
  glare: true,
  shadow: true,
});
```

## Features

- **CSS-driven** — No `requestAnimationFrame` loop.
- **~2KB gzipped** — Lightweight and fast.
- **Accelerometer** — Auto-detects gyroscope, handles iOS permissions.
- **Multi-layer parallax** — Easy depth layering with `data-levita-offset`.

For full documentation and framework wrappers, visit the [main repository](https://github.com/jeromearsene/levita#readme).
