# @levita-js/angular

## 0.3.1

### Patch Changes

- [`e3204c9`](https://github.com/Jeromearsene/levita/commit/e3204c9b9a6c838b1588b6fd26d136ad9a38096c) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - Framework packages now re-export style.css from the core package. Users can import styles directly from their framework package (e.g. `import '@levita-js/react/style.css'`) instead of importing from `levita-js`.

- Updated dependencies []:
  - levita-js@0.3.1

## 0.3.0

### Minor Changes

- [`9b8cdc4`](https://github.com/Jeromearsene/levita/commit/9b8cdc4fff988db50ddc5f0d5e5060bf656efb63) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - Add gyroRange and gyroSmoothing options for fine-tuning gyroscope behavior

### Patch Changes

- Updated dependencies [[`9b8cdc4`](https://github.com/Jeromearsene/levita/commit/9b8cdc4fff988db50ddc5f0d5e5060bf656efb63)]:
  - levita-js@0.3.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`25f1909`](https://github.com/Jeromearsene/levita/commit/25f1909cac019c6dc98e9e311f082851d44cc1a7)]:
  - levita-js@0.2.1

## 0.2.0

### Minor Changes

- [`8399af4`](https://github.com/Jeromearsene/levita/commit/8399af47f17421a42ac085eb0752ee1f295e68b5) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - ### Features

  - **update() method**: Update options (`max`, `scale`, `speed`, `easing`, `perspective`, `reverse`, `axis`, `reset`) at runtime without destroying/recreating the instance. New `UpdatableOptions` type exported for TypeScript users.

  ### Performance

  - **rAF throttle**: CSS property updates and `move` event emission are now coalesced via `requestAnimationFrame`, preventing main thread saturation with high-polling rate mice.
  - **Redundant scale removal**: `--levita-scale` is no longer re-set on every frame — only on enter and reset.

  ### Bug Fixes

  - **Gyroscope calibration**: The initial device position is now captured as baseline on start, so holding the phone at an angle no longer offsets the tilt.
  - **Edge detection**: Stabilized pointer edge detection to prevent infinite event loops.
  - **Pointer sensor**: Simplified pointer handling with `offsetWidth`/`offsetHeight` for stable dimensions unaffected by 3D transforms.

### Patch Changes

- Updated dependencies [[`8399af4`](https://github.com/Jeromearsene/levita/commit/8399af47f17421a42ac085eb0752ee1f295e68b5)]:
  - levita-js@0.2.0

## 0.1.6

### Patch Changes

- [`5ab7845`](https://github.com/Jeromearsene/levita/commit/5ab7845d2ad9a56488bc7d6af7e25af2418bb2fc) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - - **Angular**: Added official Angular wrapper (`@levita-js/angular`) featuring a standalone attribute directive.
  - **Examples**: Added standalone framework examples (Vanilla, React, Vue, Svelte, Angular) with one-click StackBlitz integration for real-time experimentation.
  - **Documentation**: Updated README and interactive demo to include Angular.
- Updated dependencies [[`5ab7845`](https://github.com/Jeromearsene/levita/commit/5ab7845d2ad9a56488bc7d6af7e25af2418bb2fc)]:
  - levita-js@0.1.6
