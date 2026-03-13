# @levita-js/svelte

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

## 0.1.5

### Patch Changes

- [`e611099`](https://github.com/Jeromearsene/levita/commit/e611099a9825f86e3ae0e1141f4b322818a85d28) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - - **Examples**: Added standalone framework examples (Vanilla, React, Vue, Svelte) with one-click StackBlitz integration for real-time experimentation.
  - **Demo**: Completely refactored the landing page using Preact for better maintainability and responsiveness.
  - **Styling**: Added a new "Styling Agnostic" section showcasing Levita working seamlessly with Tailwind CSS, Bootstrap, Bulma, Semantic UI, and Flowbite.
  - **Core**: Added a safety check to prevent accelerometer permission requests on destroyed instances.
  - **Documentation**: Improved README with an interactive Table of Contents, consolidated Ecosystem section, and official StackBlitz badges.
  - **CI/CD**: Integrated Gitleaks for secret scanning and markdownlint for documentation quality.
- Updated dependencies [[`e611099`](https://github.com/Jeromearsene/levita/commit/e611099a9825f86e3ae0e1141f4b322818a85d28)]:
  - levita-js@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [[`82f1399`](https://github.com/Jeromearsene/levita/commit/82f13991f37c4b5ae99f7cbdbeae1a838822ded5)]:
  - levita-js@0.1.4

## 0.1.3

### Patch Changes

- [`fdbf5c2`](https://github.com/Jeromearsene/levita/commit/fdbf5c2c4535cea8ac7b593950844e5cf1a25350) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - docs: include individual README files for NPM packages.

- Updated dependencies [[`fdbf5c2`](https://github.com/Jeromearsene/levita/commit/fdbf5c2c4535cea8ac7b593950844e5cf1a25350)]:
  - levita-js@0.1.3

## 0.1.2

### Patch Changes

- [`a1fe1d9`](https://github.com/Jeromearsene/levita/commit/a1fe1d98880d290c30080e967aafacc119442725) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - docs: include README files for NPM packages.

- Updated dependencies [[`a1fe1d9`](https://github.com/Jeromearsene/levita/commit/a1fe1d98880d290c30080e967aafacc119442725)]:
  - levita-js@0.1.2

## 0.1.1

### Patch Changes

- [`ceed77a`](https://github.com/Jeromearsene/levita/commit/ceed77a353027f5448b4b78fb1f2a1a77bc2d442) Thanks [@Jeromearsene](https://github.com/Jeromearsene)! - Initial release under the `levita-js` and `@levita-js` NPM scope.

- Updated dependencies [[`ceed77a`](https://github.com/Jeromearsene/levita/commit/ceed77a353027f5448b4b78fb1f2a1a77bc2d442)]:
  - levita-js@0.1.1
