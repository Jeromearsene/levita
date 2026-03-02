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

## 📈 Performance Tracking

Benchmarks are automatically run during CI. Results are converted to JSON badges in the README.

---

*Levita — Lightweight 3D tilt & parallax library.*
