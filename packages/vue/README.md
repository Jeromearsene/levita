# @levita-js/vue

> Vue 3 wrapper for Levita — Lightweight 3D tilt & parallax with accelerometer support.

## Installation

```bash
npm install levita-js @levita-js/vue
```

## Quick Start

```vue
<script setup>
import { Tilt } from "@levita-js/vue";
import "levita-js/style.css";
</script>

<template>
  <Tilt :glare="true" :shadow="true" :max="20">
    <div class="card-content">
      <h1>Tilt Me!</h1>
    </div>
  </Tilt>
</template>
```

## Documentation

Full options and advanced usage documentation can be found at the [main Levita repository](https://github.com/jeromearsene/levita#readme).
