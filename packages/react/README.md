# @levita-js/react

> React wrapper for Levita — Lightweight 3D tilt & parallax with accelerometer support.

## Installation

```bash
npm install levita-js @levita-js/react
```

## Quick Start

```tsx
import { Tilt } from "@levita-js/react";
import "levita-js/style.css";

function MyCard() {
  return (
    <Tilt glare shadow max={20}>
      <div className="card-content">
        <h1>Tilt Me!</h1>
      </div>
    </Tilt>
  );
}
```

## Documentation

Full options and advanced usage documentation can be found at the [main Levita repository](https://github.com/jeromearsene/levita#readme).
