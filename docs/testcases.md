# Test Cases — Morrow Supply (QA Assessment)

**Target app:** https://qa-task--oyettijon.replit.app/
**Store:** "Morrow Supply" — a practice e-commerce storefront.

Test data (accounts, selectors, product catalog, constants) lives in [`test_data.md`](test_data.md). Bugs are logged as tickets in [`bugs.md`](bugs.md). Test cases reference data by role/placeholder and never hardcode product names, prices, or totals.

## Conventions

| Placeholder | Meaning |
| --- | --- |
| `{product}` | Any product from the catalog in `test_data.md`. |
| `{price}` | That product's `Price` from `test_data.md`. |
| `{slug}` | That product's `URL slug` from `test_data.md`. |
| `{qty}` | A quantity (integer). |
| `{N}` | A count derived from the catalog in `test_data.md`. |
| `tax_rate` | The tax constant from `test_data.md` (default 8%). |
| `search_term` / `no_result_term` | Search inputs from `test_data.md`. |

Expected monetary results are expressed as formulas rather than fixed numbers, e.g. `subtotal = Σ(price × qty)`, `tax = round(subtotal × tax_rate, 2)`, `total = subtotal + tax`.

> Tax is rounded at the subtotal level (`round(subtotal × tax_rate, 2)`). Confirm the app applies this rounding (vs. per-line) before automating.

### Test case fields

| Field | Meaning |
| --- | --- |
| `testcase_id` | `TC-{MODULE}-{LEVEL}-{NN}`, e.g. `TC-CART-SANITY-01`, `TC-GALLERY-E2E-04`. |
| `testcase_title` | Short human-readable description. |
| `precondition` | State that must exist before running the test. |
| `test_steps` | Numbered actions to perform. |
| `expect_result` | The expected outcome / assertion. |
| `priority` | `High` / `Medium` / `Low`. |
| `notes` | Bug references and caveats (omitted when `—`). |
| `tags` | Optional tags, e.g. `skipped`. Omitted when empty. |

### Levels

| Level | Meaning |
| --- | --- |
| `SANITY` | Smoke test — a core workflow / happy path. If it fails, something is seriously broken. Run first. |
| `E2E` | The regression set — edge cases, negative cases, and more detailed/combination workflows. |

---

## Part 1 — Sanity Tests (`@sanity`)

### 1. Authentication

#### TC-AUTH-SANITY-01 — Login with valid credentials

- **testcase_id:** `TC-AUTH-SANITY-01`
- **testcase_title:** Login with valid credentials
- **precondition:** None
- **test_steps:**
  1. Navigate to the app root (redirects to `/login`).
  2. Enter the Shopper account username and password.
  3. Click **Login**.
- **expect_result:** User is redirected to the store home (`/`); nav shows the Shopper username and **Log out**; the full catalog is listed.
- **priority:** High
- **notes:** —

#### TC-AUTH-SANITY-02 — Logout returns to login

- **testcase_id:** `TC-AUTH-SANITY-02`
- **testcase_title:** Logout returns to login
- **precondition:** Logged in (any account).
- **test_steps:**
  1. Click **Log out**.
- **expect_result:** User is redirected to `/login`.
- **priority:** High
- **notes:** —

### 2. Gallery (Product Listing)

#### TC-GALLERY-SANITY-01 — Catalog loads with all items

- **testcase_id:** `TC-GALLERY-SANITY-01`
- **testcase_title:** Catalog loads with all items
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Navigate to `/`.
- **expect_result:** "The supply shelf" heading and "`{N}` items to explore" (where `{N}` = catalog size) are shown; each product card renders with name, price, review count, and description.
- **priority:** High
- **notes:** —

#### TC-GALLERY-SANITY-02 — Search (lowercase, uppercase, partial name, category name)

- **testcase_id:** `TC-GALLERY-SANITY-02`
- **testcase_title:** Search (lowercase, uppercase, partial name, category name)
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Search the **lowercase** term from the Search terms table in `test_data.md`; verify only the expected match is listed.
  2. Search the **uppercase** term; verify the same product is listed (case-insensitive).
  3. Search the **partial name** term (a substring of a product name); verify the expected match.
  4. Search the **category name** term; verify all products in that category are listed.
- **expect_result:** Search is case-insensitive and matches partial product names and category names, returning the correct products for each term.
- **priority:** High
- **notes:** —

#### TC-GALLERY-SANITY-03 — Filter by all categories

- **testcase_id:** `TC-GALLERY-SANITY-03`
- **testcase_title:** Filter by all categories
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Select each category in the filter in turn: "All categories", "Apparel", "Accessories", "Gear", and "Books".
  2. For each selection, verify the shown count matches the catalog in `test_data.md`.
- **expect_result:** Each category shows only its products with the correct count; "All categories" restores the full catalog.
- **priority:** High
- **notes:** —

#### TC-GALLERY-SANITY-04 — Sort by all options (name A→Z / Z→A, price low→high / high→low)

- **testcase_id:** `TC-GALLERY-SANITY-04`
- **testcase_title:** Sort by all options (name A→Z / Z→A, price low→high / high→low)
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Select "Name: A to Z" (`name-az`); verify products are ordered alphabetically ascending.
  2. Select "Name: Z to A" (`name-za`); verify alphabetical descending.
  3. Select "Price: Low to High" (`price-low`); verify ascending `Price`.
  4. Select "Price: High to Low" (`price-high`); verify descending `Price`.
- **expect_result:** Each of the four sort options orders products correctly.
- **priority:** High
- **notes:** ⚠️ "Price: High to Low" sorts ascending (same as low→high) — see BUG-002.
- **tags:** skipped

### 3. Product Detail Page

#### TC-PDP-SANITY-01 — Open product detail

- **testcase_id:** `TC-PDP-SANITY-01`
- **testcase_title:** Open product detail
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Click a product name/image link.
- **expect_result:** Navigates to `/product/{slug}`; shows product name, category, review count, price, and description.
- **priority:** High
- **notes:** —

### 4. Cart

#### TC-CART-SANITY-01 — Add to Cart

- **testcase_id:** `TC-CART-SANITY-01`
- **testcase_title:** Add to Cart
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. On the home page, click **Add to Cart** on a product card.
- **expect_result:** The button briefly shows "Added!", the cart badge increments, and the item appears in the cart.
- **priority:** High
- **notes:** ⚠️ Fails for one catalog product (identified in BUG-001); the rest work.

### 5. Checkout

#### TC-CHECKOUT-SANITY-01 — Happy path checkout

- **testcase_id:** `TC-CHECKOUT-SANITY-01`
- **testcase_title:** Happy path checkout
- **precondition:** Logged in as the Shopper account, with items in the cart.
- **test_steps:**
  1. From the cart, click **Proceed to Checkout**; verify navigation to `/checkout`.
  2. Fill First Name / Last Name / Postal Code and click **Continue**; verify the "Order Summary" step.
  3. Click **Finish**; verify the "Order Placed!" confirmation.
  4. Click **Continue Shopping**; verify the cart badge is cleared and the cart page is empty.
- **expect_result:** The checkout completes through to confirmation; after clicking Continue Shopping, the cart is cleared.
- **priority:** High
- **notes:** —

### 6. Full Journey

#### TC-JOURNEY-SANITY-01 — Full happy path (login → browse → add → cart → checkout → confirm)

- **testcase_id:** `TC-JOURNEY-SANITY-01`
- **testcase_title:** Full happy path (login → browse → add → cart → checkout → confirm)
- **precondition:** None (fresh browser session, empty cart).
- **test_steps:**
  1. Log in as the Shopper account.
  2. Verify the catalog loads and shows the full item count.
  3. Add a product from the **top** of the list to the cart.
  4. Add a product from the **bottom** of the list to the cart.
  5. Open the cart and verify the item count and totals are consistent with the sum of the added items (line totals, subtotal, tax, total).
  6. Adjust the quantity of one item and verify the totals recalculate.
  7. Click **Proceed to Checkout**, fill the shipping information, and click **Continue**.
  8. Verify the Order Summary shows the correct items, shipping-to, and totals.
  9. Click **Finish**.
  10. Verify the Order Confirmation page; click **Continue Shopping** and verify the cart is cleared.
- **expect_result:** The full journey completes with consistent totals and state at every step (badge, cart, order summary, and post-order cart all agree).
- **priority:** High
- **notes:** Cross-page smoke test — expected totals use the formulas in the Conventions section. Drive via in-app clicks only (no page reload or direct URL), as the session is not persisted across full page loads (BUG-006).

---

## Part 2 — E2E Tests (`@e2e`)

### 1. Authentication

#### TC-AUTH-E2E-01 — Invalid login attempts are rejected

- **testcase_id:** `TC-AUTH-E2E-01`
- **testcase_title:** Invalid login attempts are rejected
- **precondition:** None
- **test_steps:**
  1. Enter the Shopper username with a wrong password and click **Login**; verify an error is shown and you stay on `/login`.
  2. Leave both fields empty and click **Login**; verify validation feedback is shown (no navigation).
  3. Enter the Locked account credentials and click **Login**; verify the locked-out error.
- **expect_result:** All three invalid attempts are rejected with appropriate feedback; the user stays on `/login` (the Locked account shows "Sorry, this user has been locked out.").
- **priority:** Medium
- **notes:** —

#### TC-AUTH-E2E-02 — Login form UI: password visibility and practice-account buttons

- **testcase_id:** `TC-AUTH-E2E-02`
- **testcase_title:** Login form UI: password visibility and practice-account buttons
- **precondition:** None
- **test_steps:**
  1. Type a password, click the toggle-password-visibility button, then click it again.
  2. Click each practice-account button (one per account in `test_data.md`) and verify the fields are populated.
- **expect_result:** The password field toggles between masked (`type=password`) and visible (`type=text`); each practice-account button fills **both** the username and password fields with that account's credentials.
- **priority:** Low
- **notes:** —

#### TC-AUTH-E2E-03 — Session persists across a page reload

- **testcase_id:** `TC-AUTH-E2E-03`
- **testcase_title:** Session persists across a page reload
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Reload the page (or navigate directly to a URL such as `/cart`).
- **expect_result:** The user remains logged in.
- **priority:** Medium
- **notes:** ⚠️ Currently FAILS — see BUG-006.

### 2. Gallery

#### TC-GALLERY-E2E-01 — Search + filter

- **testcase_id:** `TC-GALLERY-E2E-01`
- **testcase_title:** Search + filter
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term and select a category.
- **expect_result:** Only products that match **both** the search term and the selected category are shown.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-E2E-02 — Search + sort

- **testcase_id:** `TC-GALLERY-E2E-02`
- **testcase_title:** Search + sort
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term and select a sort option.
- **expect_result:** The matching products are ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-E2E-03 — Filter + sort

- **testcase_id:** `TC-GALLERY-E2E-03`
- **testcase_title:** Filter + sort
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Select a category and a sort option.
- **expect_result:** The category's products are shown, ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-E2E-04 — Search + filter + sort

- **testcase_id:** `TC-GALLERY-E2E-04`
- **testcase_title:** Search + filter + sort
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term, select a category, and select a sort option.
- **expect_result:** Only products matching both the search term and category are shown, ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-E2E-05 — Search with no results and clear filters

- **testcase_id:** `TC-GALLERY-E2E-05`
- **testcase_title:** Search with no results and clear filters
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Type `no_result_term` from `test_data.md`; verify "0 items to explore" and an empty-state message with a **Clear filters** button.
  2. Click **Clear filters**; verify the full catalog is restored.
- **expect_result:** The empty state renders correctly and Clear filters restores the full catalog.
- **priority:** Medium
- **notes:** —

### 3. Product Detail Page

#### TC-PDP-E2E-01 — Quantity controls and Back to products

- **testcase_id:** `TC-PDP-E2E-01`
- **testcase_title:** Quantity controls and Back to products
- **precondition:** Logged in as the Shopper account, on a product detail page.
- **test_steps:**
  1. Click "+" then "−"; verify the quantity increments/decrements with a minimum of `qty_min`.
  2. Click **Back to products**; verify return to the catalog (`/`).
- **expect_result:** Quantity clamps at the minimum; Back returns to the catalog.
- **priority:** Medium
- **notes:** —

#### TC-PDP-E2E-02 — Repeated Add to Cart (interaction limit)

- **testcase_id:** `TC-PDP-E2E-02`
- **testcase_title:** Repeated Add to Cart (interaction limit)
- **precondition:** Logged in as the Shopper account, on a product detail page.
- **test_steps:**
  1. Click **Add to Cart** 7 times for the same product.
- **expect_result:** Items continue to be added (or a clear, dismissible error).
- **priority:** Low
- **notes:** ⚠️ The 7th click triggers the "System overload" error banner and blocks further adds — see BUG-007.

### 4. Cart

#### TC-CART-E2E-01 — Cart totals, quantity changes, and removal

- **testcase_id:** `TC-CART-E2E-01`
- **testcase_title:** Cart totals, quantity changes, and removal
- **precondition:** Logged in as the Shopper account, with items in the cart.
- **test_steps:**
  1. Open a product detail page, set a quantity, and click **Add to Cart**; verify the badge increments by that quantity.
  2. Open the cart; verify the item count and totals match the formula (line total = `{qty}` × `{price}`; Subtotal; Tax = round(subtotal × `tax_rate`, 2); Total = Subtotal + Tax).
  3. Use the cart "+" / "−" controls; verify totals recalculate (decreasing from 1 removes the item).
  4. Click **Remove** on a line item; verify the item is removed and the badge/totals update.
  5. With an empty cart, verify "Your cart is empty" and that **Continue Shopping** returns to the catalog.
- **expect_result:** Adding from detail, totals, quantity changes, removal, and the empty state all behave correctly.
- **priority:** High
- **notes:** ⚠️ Add to Cart from detail does nothing for one product — see BUG-001.

### 5. Checkout

#### TC-CHECKOUT-E2E-01 — Required-field validation

- **testcase_id:** `TC-CHECKOUT-E2E-01`
- **testcase_title:** Required-field validation
- **precondition:** Logged in as the Shopper account, with items in the cart, on `/checkout`.
- **test_steps:**
  1. Click **Continue** with all fields empty.
- **expect_result:** Each field shows a required-field error; the user stays on the shipping step.
- **priority:** High
- **notes:** ⚠️ Error text is wrong for First Name — see BUG-004.

#### TC-CHECKOUT-E2E-02 — Checkout totals are correct

- **testcase_id:** `TC-CHECKOUT-E2E-02`
- **testcase_title:** Checkout totals are correct
- **precondition:** Logged in as the Shopper account; cart contains `{qty}` × a product `{product}` (price `{price}`), e.g. `{qty}` = 3.
- **test_steps:**
  1. Fill First Name / Last Name / Postal Code and click **Continue** to reach the "Order Summary" step.
- **expect_result:** Subtotal = `{qty}` × `{price}`; Tax = round(`{qty}` × `{price}` × `tax_rate`, 2); Total = Subtotal + Tax.
- **priority:** Medium
- **notes:** —

### 6. Account-specific

#### TC-ACCOUNT-E2E-01 — Image-variation account shows correct product images

- **testcase_id:** `TC-ACCOUNT-E2E-01`
- **testcase_title:** Image-variation account shows correct product images
- **precondition:** Logged in as the Image-variation account.
- **test_steps:**
  1. Browse the catalog and inspect each product's image/label.
- **expect_result:** Product images/labels match their products (name, illustration, and text label are consistent).
- **priority:** Medium
- **notes:** ⚠️ Images are mismatched — see BUG-005.

#### TC-ACCOUNT-E2E-02 — Cart-badge account shows an accurate badge count

- **testcase_id:** `TC-ACCOUNT-E2E-02`
- **testcase_title:** Cart-badge account shows an accurate badge count
- **precondition:** Logged in as the Cart-badge account.
- **test_steps:**
  1. Add and remove items, observing the cart badge after each change.
- **expect_result:** The cart badge always equals the number of items in the cart.
- **priority:** Medium
- **notes:** ⚠️ Badge is off by one — see BUG-003.

---

## Part 3 — Mobile-responsive

> A separate responsive dimension (re-versioning core flows at a phone viewport). Run at `mobile_viewport` from `test_data.md` (375 × 812). "Responsive" means: no horizontal scrolling; key controls are visible, correctly sized, and tappable; the flow completes identically to desktop.

### TC-MOB-E2E-01 — Login, catalog, and Add to Cart at mobile viewport

- **testcase_id:** `TC-MOB-E2E-01`
- **testcase_title:** Login, catalog, and Add to Cart at mobile viewport
- **precondition:** None; viewport set to `mobile_viewport`.
- **test_steps:**
  1. Open the login page and verify the form renders without horizontal scroll.
  2. Log in as the Shopper account.
  3. Verify product cards render in a responsive 2-column grid at `mobile_viewport` with no horizontal scroll.
  4. Tap **Add to Cart** on a product; verify the cart badge increments.
- **expect_result:** Login, catalog (responsive 2-column grid), and add-to-cart work at mobile viewport with no horizontal scroll.
- **priority:** Medium
- **notes:** —

### TC-MOB-E2E-02 — Cart and checkout at mobile viewport

- **testcase_id:** `TC-MOB-E2E-02`
- **testcase_title:** Cart and checkout at mobile viewport
- **precondition:** Logged in as the Shopper account, with an item in the cart; viewport set to `mobile_viewport`.
- **test_steps:**
  1. Open the cart; verify it renders without horizontal scroll.
  2. Tap **Proceed to Checkout**.
  3. Fill the shipping fields and tap **Continue**; verify the flow advances to the Order Summary.
- **expect_result:** The cart and checkout forms render without horizontal scroll and the flow advances to the Order Summary.
- **priority:** Medium
- **notes:** —
