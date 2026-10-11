# @levita-js/haptics

> Haptic feedback plugin for Levita — Vibration feedback on tilt interactions (Android only, via the Vibration API).

## Installation

```bash
npm install levita-js @levita-js/haptics
```

## Quick Start

```ts
import { haptics, isHapticsSupported } from "@levita-js/haptics";

const plugins = isHapticsSupported() ? [haptics()] : [];

new Levita(element, { plugins });
```

## Documentation

Full options and advanced usage documentation can be found at the [main Levita repository](https://github.com/jeromearsene/levita#readme).
