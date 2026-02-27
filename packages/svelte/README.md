# @levita-js/svelte

> Svelte action for Levita — Lightweight 3D tilt & parallax with accelerometer support.

## Installation

```bash
npm install levita-js @levita-js/svelte
```

## Quick Start

```svelte
<script>
  import { tilt } from "@levita-js/svelte";
  import "levita-js/style.css";
</script>

<div use:tilt={{ glare: true, shadow: true, max: 20 }}>
  <h1>Tilt Me!</h1>
</div>
```

## Documentation

Full options and advanced usage documentation can be found at the [main Levita repository](https://github.com/jeromearsene/levita#readme).
