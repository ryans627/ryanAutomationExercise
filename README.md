# Morrow Supply — E2E Test Framework

End-to-end UI test suite for the **Morrow Supply** practice storefront, built with
[WebdriverIO v9](https://webdriver.io/), TypeScript, and Mocha.

- **Target app:** https://qa-task--oyettijon.replit.app/
- **Test cases:** [`docs/testcases.md`](docs/testcases.md)
- **Bug tickets:** [`docs/bugs.md`](docs/bugs.md)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes npm)
- Google Chrome

## Setup

```bash
npm install
```

## Running the tests

| Command | Description |
| --- | --- |
| `npm run wdio` | Run the full suite (headed Chrome, parallel) |
| `npm run wdio:headless` | Run the full suite headlessly |
| `npm run wdio:seq` | Run spec files one at a time (`MAX_INSTANCES=1`) |
| `npm run test:report` | Run headless, then generate and open the Allure report |
| `npm run report` | (Re)generate and open the Allure report from the last run |

Run a single spec file:

```bash
npx wdio run ./wdio.conf.ts --spec src/specs/user-auth/e2e.user-auth.sanity.spec.ts
```

Run a single test by name:

```bash
npx wdio run ./wdio.conf.ts --spec src/specs/user-auth/e2e.user-auth.sanity.spec.ts --mochaOpts.grep "TC-AUTH-01"
```

## Project structure

```
src/
├── constants/      # URLs, data-test selectors, accounts (constants.ts), product catalog (testData.ts)
├── pages/          # Page objects (Page base class + header component + login/gallery/product/cart/checkout)
├── specs/          # Mocha specs, organized by feature (sanity + regression levels)
└── utils/          # Shared helpers (locators, currency/percentage parsing, auth)
docs/
├── testcases.md    # Full test-case catalogue (TC-{MODULE}-{NN})
├── bugs.md         # Bug tickets (BUG-xxx) with screenshots
└── screenshots/    # Bug evidence
```

## Test data & accounts

Practice accounts are listed on the login page. They are defined in
`src/constants/constants.ts` (`ACCOUNTS`, `PASSWORD`), and the product catalog in
`src/constants/testData.ts` (`CATALOG`).

## Notes

- Tests drive the app through in-app clicks only. The session is not persisted
  across full page loads (`BUG-006`), so page objects avoid direct URL loads.
- The 7th "Add to Cart" click triggers a "System overload" banner (`BUG-007`).
- A few tests are marked `it.skip` where they exercise known defects; each is
  referenced in [`docs/bugs.md`](docs/bugs.md).
