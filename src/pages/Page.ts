import { HOST } from "../constants/constants";

/**
 * Base class for all page objects.
 *
 * Every page object extends `Page` and supplies:
 * - `path` — the URL path appended to {@link HOST} to reach this page.
 * - `elements` — an object of locator functions, each returning a fresh element
 *   (`usernameInput: () => getByDataTest(...)`, `addToCartButton: (slug) => getByDataTest(...)`).
 * - `actions` — an object of async methods that drive the page.
 *
 * `navigate()` is inherited; override it only when the path is parameterized
 * (see `ProductPage`).
 */
export abstract class Page {
  protected abstract readonly path: string;

  abstract readonly elements: object;
  abstract readonly actions: object;

  async navigate(): Promise<void> {
    await browser.url(`${HOST}${this.path}`);
  }
}
