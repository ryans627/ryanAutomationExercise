# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WebdriverIO v9 end-to-end test framework for an interview exercise. TypeScript + Mocha, run locally against Chrome. Tests target `https://automation-interview.vercel.app/`.

## Commands

- Install dependencies: `npm install`
- Run the full suite: `npm run wdio` (expands to `wdio run ./wdio.conf.ts`)
- Run a single spec file: `npx wdio run ./wdio.conf.ts --spec src/specs/accessPage.ts`
- Run a single test by name: `npx wdio run ./wdio.conf.ts --spec src/specs/accessPage.ts --mochaOpts.grep "Open WebPage"`

There is no build or lint step. WebdriverIO's local runner compiles TypeScript on the fly via `tsConfigPath` (`tsconfig.json` sets `noEmit: true`), so specs and page objects are executed directly from `.ts` files.

## Architecture

- **Page Object Model** — page objects live in `src/pages/`, Mocha specs in `src/specs/`. Specs import page objects and interact with the browser only through them; page objects call the injected WebdriverIO globals (`browser`, `$`, `$$`) directly.
- **`wdio.conf.ts` is the single source of truth.** It is the stock WebdriverIO template with a large commented-out block of hooks. The active settings are at the top: `specs: ["src/specs/**/*.ts"]`, `framework: "mocha"`, `reporters: ["spec"]`, one `chrome` capability, `maxInstances: 10`. `baseUrl` is **not** set — `StorePage.open()` hardcodes the target URL.
- **ESM + globals** — `package.json` sets `"type": "module"`. Tests rely on `@wdio/globals` (`browser`, `expect`, `$`, `$$`); `expect` is imported from `@wdio/globals` at the top of each spec, everything else is auto-injected.
- **Spec isolation** — each spec file runs in its own worker process (WebdriverIO local runner), so no state is shared between spec files.

## Notes

- There is no `.gitignore`, so `node_modules/` is currently tracked in git (~20 MB). New projects should not add dependencies directly to this repo without first deciding whether to add a `.gitignore`.
