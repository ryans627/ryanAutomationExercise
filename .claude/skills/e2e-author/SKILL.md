---
name: e2e-author
description: Author or extend WebdriverIO E2E tests in this repo (specs, page objects, selectors/constants, test data). Use when writing new specs, adding page objects, or automating a test case from docs/testcases.md.
---

# E2E Author

Conventions for writing WebdriverIO E2E tests in this repository. Read `CLAUDE.md`
for the high-level architecture; this skill covers the authoring conventions and
gotchas, using the existing pages/specs as the reference style.

## Before writing a test

1. Find the test case in `docs/testcases.md` (IDs are `TC-{MODULE}-{NN}`). If it
   doesn't exist, add it there first — specs mirror the plan.
2. Check `src/constants/constants.ts` (`DATATEST`, `ACCOUNTS`, `MESSAGES`) and
   `src/constants/testData.ts` (`CATALOG`) for the data you need. New `data-test`
   selectors must be added to `DATATEST`.
3. Check `docs/bugs.md` for known failures — reference them as `BUG-xxx`, mark
   affected tests `.skip`, and note it in the test-case `notes`.

## Layout

- Page objects: `src/pages/*.ts` — one per page, each extending the `Page` base.
- Specs: `src/specs/{module}/e2e.{module}.{level}.spec.ts`, `level` is `sanity`
  or `regression`. Folders: `user-auth`, `product-gallery`, `checkout-flow`, `mobile`.
- Constants: `src/constants/constants.ts` + `src/constants/testData.ts`. Helpers: `src/utils/helpers.ts`.

## Page object conventions

Every page object extends `Page` (`src/pages/Page.ts`) and provides three members:

- `path` — URL path appended to `HOST`.
- `elements` — an object of **arrow functions** returning a fresh element. Use
  `getByDataTest` (single) or `getAllByDataTest` (plural); parameterized
  selectors are inline template literals:
  ```ts
  readonly elements = {
    usernameInput: () => getByDataTest(DATATEST.username),
    productNameLinks: () => getAllByDataTest(DATATEST.inventoryItemName),
    addToCartButton: (slug: string) => getByDataTest(`add-to-cart-${slug}`),
  };
  ```
  Access elements with `()`: `this.elements.usernameInput()`.
- `actions` — an object of async methods. Multi-field actions take a single
  object argument; single-value actions stay positional. Form filling clears
  first, then sets:
  ```ts
  readonly actions = {
    fillOutFields: async ({ username, password }: { username: string; password: string }) => {
      await this.elements.usernameInput().clearValue();
      await this.elements.passwordInput().clearValue();
      await this.elements.usernameInput().setValue(username);
      await this.elements.passwordInput().setValue(password);
    },
    login: async ({ username, password }: { username: string; password: string }) => {
      await this.actions.fillOutFields({ username, password });
      await this.elements.loginButton().click();
    },
  };
  ```
  Override `navigate()` only for parameterized paths (see `ProductPage`).

Never use `$` / `$$` directly in page objects — always `getByDataTest` /
`getAllByDataTest`.

## Selectors, accounts, messages

- `DATATEST` holds raw `data-test` attribute values (kebab-case keys).
- `ACCOUNTS` (usernames) + `PASSWORD` hold test credentials.
- `MESSAGES` holds user-facing text as **case-insensitive RegExp** built with
  `getCaseInsensitiveMsg`, so assertions tolerate case differences:
  ```ts
  export const MESSAGES = {
    usernameRequired: getCaseInsensitiveMsg("Username is required"),
    lockedOut: getCaseInsensitiveMsg("Sorry, this user has been locked out"),
  } as const;
  ```

## Spec conventions

```ts
import { expect } from "@wdio/globals";
import { ACCOUNTS, HOST, MESSAGES, PASSWORD, PATHS } from "../../constants/constants";
import loginPage from "../../pages/loginPage";

describe("User authentication — regression", () => {
  beforeEach(async () => {
    await loginPage.navigate();
  });

  it("TC-AUTH-03: User should see an error and stay on the login page when submitting invalid credentials", async () => {
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: "wrong-password" });

    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
    await expect(loginPage.elements.errorMessage()).toBeDisplayed();
    await expect(loginPage.elements.errorMessage()).toHaveText(MESSAGES.invalidCredentials);
  });
});
```

Rules:

- `it` title: `"TC-{MODULE}-{NN}: {scenario} should {expected result}"` (colon +
  space). No level in the ID.
- Assertions live in specs, not page objects. Import `expect` from `@wdio/globals`.
- Assertion order: URL/navigation first, then `toBeDisplayed()` (visibility), then
  `toHaveText(...)` (content).
- Every scenario that logs in successfully asserts the username:
  `await expect(loginPage.elements.loggedInUser()).toHaveText(username);`
- One test case with multiple steps is one `it` block; separate steps with
  `// comments`.

## Gotchas

- **No `toHaveTextContaining`** in this `expect-webdriverio` version — use a
  RegExp (`toHaveText(/substring/)`) or a `MESSAGES` entry.
- **`isExisting()` does not wait** — it returned false before the error rendered.
  Use `getText()` / `toHaveText()` / `toBeDisplayed()` (auto-wait) or
  `waitForDisplayed()`.
- **React controlled inputs can't be cleared with `setValue("")` or
  `clearValue()`.** To submit empty fields, reload the page first
  (`await page.navigate()`), then click the submit button.
- Mark known-failing tests with `.skip` + `// Known failure: BUG-xxx`. Never leave
  `it.only` — it silences every other test.

## Running & debugging

- One folder: `npx wdio run ./wdio.conf.ts --spec "src/specs/user-auth/*.spec.ts"`
- One test: append `--mochaOpts.grep "TC-AUTH-01"`.
- Type-check: `npx tsc --noEmit`.
- Pause/inspect: `await browser.debug()` (interactive REPL) or
  `await browser.pause(5000)`.
- Screenshot: `await browser.saveScreenshot("docs/screenshots/name.png")`.
