# 🛠 Development Guide

Welcome to the Levita development guide! This document explains how to set up the environment, run tests, and manage the release process.

## 📦 Project Structure

This is a monorepo managed with **pnpm workspaces**:

- `packages/core`: The vanilla JS/TS engine (published as `levita-js`).
- `packages/react`: React wrapper (`@levita-js/react`).
- `packages/vue`: Vue wrapper (`@levita-js/vue`).
- `packages/svelte`: Svelte wrapper (`@levita-js/svelte`).
- `demo`: Vite-powered showcase application.
- `benchmarks`: Performance testing suite.

## 🛠 Setup

We use [Volta](https://volta.sh/) to manage Node and pnpm versions.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## 🧪 Testing & Quality

We use **Vitest** for unit tests and **Playwright** for visual regression.

### Framework Compatibility

To ensure wrappers work across multiple versions of their respective frameworks, follow these steps:

1. **Manual Link Test**:
   - In an empty directory, install the target version of the framework (e.g., `npm install react@16.8`).
   - Link your local package (e.g., `npm link ../packages/react`).
   - Verify if it compiles and runs without issues.

2. **TypeScript Check**:
   - Run `pnpm type-check` in the package directory. It uses the `devDependencies` version.
   - To test older versions, temporarily downgrade the framework in `package.json` (devDependencies) and run `pnpm install && pnpm type-check`.

3. **Automated CI Matrix**:
   - Every push to `main` and all Pull Requests trigger a GitHub Action matrix that runs unit tests against a wide range of framework versions (e.g., React 16.8 to 19, Svelte 3 to 5). This ensures we never break compatibility with our supported minimum versions.

```bash
# Run unit tests
pnpm test

# Run visual tests
pnpm test:visual

# Run benchmarks
pnpm bench

# Lint and format (Biome)
pnpm lint
```

## 🚀 Release Workflow

Levita uses [Changesets](https://github.com/changesets/changesets) for automated versioning and NPM publishing.

### 1. Adding a Change (Changeset)

Whenever you make a change that warrants a version bump, you must create a changeset:

```bash
pnpm changeset
```

- Select the affected packages.
- Choose the bump type (`patch`, `minor`, `major`).
- Write a summary (this will populate the `CHANGELOG.md`).
- **Commit the generated file** with your PR.

### 2. The Automated CI Pipeline

The release process is fully automated to ensure consistency:

1. **Pull Request**: Create a PR with your changes and a changeset file (generated via `pnpm changeset`).
2. **Merge to Main**: Once the PR is merged into `main`, the **Release** workflow triggers.
3. **Automatic Versioning PR**: If changesets are present on `main`, the CI automatically opens a new Pull Request titled **"Version Packages"**. This PR contains the version bumps and updated changelogs.
4. **Final Release**: When you merge the **"Version Packages" PR**, the CI builds the project, publishes to NPM with **OIDC Trusted Publishing**, and creates a GitHub Release with tags.
5. **Post-publish sync**: After a successful publish, the CI automatically updates the `examples/` dependencies to the newly published version and commits the result. This ensures examples always reference real npm versions for StackBlitz compatibility.

### 3. Release Scripts

Two scripts handle version synchronization during the release process:

- **`scripts/sync-peer-deps.js`**: Runs during `changeset version` (before publish). Updates `peerDependencies` in wrapper packages (`@levita-js/react`, `vue`, etc.) to match the new version.
- **`scripts/sync-examples.js`**: Runs after publish in CI (`release.yml`). Updates `dependencies` in `examples/` to point to the just-published npm version, so they work standalone on StackBlitz.

## 📈 Performance Tracking

Benchmarks are automatically run during CI. Results are converted to JSON badges in the README.

---

_Levita — Lightweight 3D tilt & parallax library._
