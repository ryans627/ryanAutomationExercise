# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WebdriverIO v9 end-to-end test framework. TypeScript + Mocha, run locally against Chrome. Tests target the "Morrow Supply" practice storefront at `https://qa-task--oyettijon.replit.app/` (host defined in `src/constants/constants.ts`).

## Commands

- Install dependencies: `npm install`
- Run the full suite: `npm run wdio` (expands to `wdio run ./wdio.conf.ts`)
- Run headless: `npm run wdio:headless` (sets `HEADLESS=1`)
- Run sequentially: `npm run wdio:seq` (sets `MAX_INSTANCES=1`; combine with any other env var, e.g. `HEADLESS=1 MAX_INSTANCES=3 npm run wdio`)
- Run a single spec file: `npx wdio run ./wdio.conf.ts --spec src/specs/user-auth/e2e.user-auth.sanity.spec.ts`
- Run a single test by name: `npx wdio run ./wdio.conf.ts --spec src/specs/user-auth/e2e.user-auth.sanity.spec.ts --mochaOpts.grep "TC-AUTH-01"`
- Open the HTML report (after a run): `npm run report` — generates `allure-report/` from `allure-results/` and opens it in the browser
- Run the suite and open the report in one step: `npm run test:report` — headless by default; `onPrepare` clears `allure-results/` first, so the report reflects only that run

There is no build or lint step. WebdriverIO's local runner compiles TypeScript on the fly via `tsConfigPath` (`tsconfig.json` sets `noEmit: true`), so specs and page objects are executed directly from `.ts` files. Type-check with `npx tsc --noEmit`.

## Architecture

- **Page Object Model** — page objects live in `src/pages/`, Mocha specs in `src/specs/`. Each page object extends the `Page` base class (`src/pages/Page.ts`) and exposes three members: `elements` (locator arrow functions, e.g. `usernameInput: () => getByDataTest(DATATEST.username)`), `actions` (async interactions), and `navigate()`. Specs drive the app only through page objects. The shared header (Shop link, cart icon + badge, signed-in username, Logout) is not a page: it lives in `src/pages/header.ts` as a `Header` component that does **not** extend `Page` (no `path`/`navigate()`), but exposes the same `elements`/`actions` shape.
- **Spec organization** — specs live in feature subfolders under `src/specs/` (`user-auth/`, `product-gallery/`, `product-detail/`, `shopping-cart/`, `checkout-flow/`, `account/`, `mobile/`), mirroring the page objects. Spec files are named `e2e.{module}.{level}.spec.ts` (e.g. `e2e.user-auth.regression.spec.ts`); the only levels are `sanity` and `regression` — the whole suite is E2E (UI tests).
- **Assertions live in specs, not page objects.** Specs import `expect` from `@wdio/globals` and assert on `page.elements.x()` (e.g. `await expect(loginPage.elements.usernameInput()).toHaveValue("...")`). Page objects expose locators + interactions but do not make pass/fail decisions.
- **Selectors & URLs are centralized.** `src/constants/constants.ts` holds `DATATEST` (raw `data-test` values), `HOST`/`PATHS`/`productPath` (URLs), and `ACCOUNTS`/`PASSWORD` (test accounts). `src/utils/helpers.ts` provides `getByDataTest(value)` / `getAllByDataTest(value)` which locate elements. Do not hardcode selector strings or the `[data-test=...]` format in page objects.
- **`wdio.conf.ts` is the single source of truth.** Active settings at the top: `specs: ["src/specs/**/*.ts"]`, `framework: "mocha"`, `reporters: ["spec", "allure"]` (Allure writes `allure-results/` for the HTML report), one `chrome` capability (headless when `HEADLESS=1`), and `maxInstances` (10 by default; `MAX_INSTANCES` overrides it, `1` = sequential). Two active hooks: `onPrepare` clears stale `allure-results/` and `screenshots/` at the start of each run, and `afterTest` attaches a failure screenshot to the Allure report; the rest of the hooks block is the stock commented-out template. `baseUrl` is **not** set — pages navigate via `HOST + PATHS`.
- **ESM + globals** — `package.json` sets `"type": "module"`. Tests rely on `@wdio/globals` (`browser`, `expect`, `$`, `$$`); `expect` is imported at the top of each spec, everything else is auto-injected.
- **Spec isolation** — each spec file runs in its own worker process, so no state is shared between spec files (within a file, tests share one browser session).

## QA planning docs (`docs/`)

`docs/` holds the plan automation should be built against. The three files cross-link each other, so keep them together:

- `testcases.md` — test cases identified by `TC-{MODULE}-{NN}`, grouped into `@sanity`, `@regression`, and mobile sections. Some are tagged `skipped` or annotated with known-bug references.
- `testData.ts` — accounts, `data-test` selectors, product catalog (name/price/slug/category), sort values, and constants (tax rate, viewport).
- `bugs.md` — bug tickets (`BUG-xxx`) with screenshots in `docs/screenshots/`.

Conventions to honor when implementing tests: steps use placeholders (`{product}`, `{price}`, `{slug}`, `{qty}`, `{N}`, `tax_rate`) resolved against `testData.ts`, and monetary assertions are formulas rather than fixed numbers. Two app behaviors that break naive automation: session is lost across full page loads (BUG-006, so drive via in-app clicks), and the 7th "Add to Cart" click triggers a "System overload" banner (BUG-007).
