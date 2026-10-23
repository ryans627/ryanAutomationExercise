# Test Cases — Morrow Supply (QA Assessment)

**Target app:** https://qa-task--oyettijon.replit.app/
**Store:** "Morrow Supply" — a practice e-commerce storefront.

Test data (accounts, selectors, product catalog, constants) lives in `src/constants/constants.ts` and `src/constants/testData.ts`. Bugs are logged as tickets in [`bugs.md`](bugs.md). Test cases reference data by role/placeholder and never hardcode product names, prices, or totals.

## Conventions

| Placeholder | Meaning |
| --- | --- |
| `{product}` | Any product from the catalog. |
| `{price}` | That product's `Price`. |
| `{slug}` | That product's `URL slug`. |
| `{qty}` | A quantity (integer). |
| `{N}` | A count derived from the catalog. |
| `tax_rate` | The tax rate (fetched from the page). |
| `search_term` / `no_result_term` | Search inputs. |

Expected monetary results are expressed as formulas rather than fixed numbers, e.g. `subtotal = Σ(price × qty)`, `tax = round(subtotal × tax_rate, 2)`, `total = subtotal + tax`.

> Tax is rounded at the subtotal level (`round(subtotal × tax_rate, 2)`). Confirm the app applies this rounding (vs. per-line) before automating.

### Test case fields

| Field | Meaning |
| --- | --- |
| `testcase_id` | `TC-{MODULE}-{NN}`, e.g. `TC-CART-01`, `TC-GALLERY-08`. |
| `testcase_title` | Short human-readable description. |
| `test_level` | `sanity` or `regression`. |
| `automated` | `yes` if covered by a spec file, `no` otherwise. |
| `precondition` | State that must exist before running the test. |
| `test_steps` | Numbered actions to perform. |
| `expect_result` | The expected outcome / assertion. |
| `priority` | `High` / `Medium` / `Low`. |
| `notes` | Bug references and caveats (omitted when `—`). |
| `tags` | Optional tags, e.g. `skipped`. Omitted when empty. |

### Levels

| Level | Meaning |
| --- | --- |
| `sanity` | Smoke test — a core workflow / happy path. If it fails, something is seriously broken. Run first. |
| `regression` | The regression set — edge cases, negative cases, and more detailed/combination workflows. |

---

## Authentication

#### TC-AUTH-01 — User with valid credentials should be able to log in successfully

- **testcase_id:** `TC-AUTH-01`
- **testcase_title:** User with valid credentials should be able to log in successfully
- **test_level:** sanity
- **automated:** yes
- **precondition:** None
- **test_steps:**
  1. Navigate to the app root (redirects to `/login`).
  2. Enter the Shopper account username and password.
  3. Click **Login**.
- **expect_result:** User is redirected to the store home (`/`); nav shows the Shopper username and **Log out**; the full catalog is listed.
- **priority:** High
- **notes:** —

#### TC-AUTH-02 — User should be logged out and redirected to the login page when clicking logout

- **testcase_id:** `TC-AUTH-02`
- **testcase_title:** User should be logged out and redirected to the login page when clicking logout
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in (any account).
- **test_steps:**
  1. Click **Log out**.
- **expect_result:** User is redirected to `/login`.
- **priority:** High
- **notes:** —

#### TC-AUTH-03 — User should see an error and stay on the login page when submitting invalid credentials

- **testcase_id:** `TC-AUTH-03`
- **testcase_title:** User should see an error and stay on the login page when submitting invalid credentials
- **test_level:** regression
- **automated:** yes
- **precondition:** None
- **test_steps:**
  1. Enter the Shopper username with a wrong password and click **Login**; verify an error is shown and you stay on `/login`.
  2. Leave both fields empty and click **Login**; verify validation feedback is shown (no navigation).
  3. Enter the Locked account credentials and click **Login**; verify the locked-out error.
- **expect_result:** All three invalid attempts are rejected with appropriate feedback; the user stays on `/login` (the Locked account shows "Sorry, this user has been locked out.").
- **priority:** Medium
- **notes:** ⚠️ When only Password is empty, the error shows "Username is required" instead of "Password is required" — see BUG-008.

#### TC-AUTH-04 — User should be able to auto-fill via practice-account buttons, log in, and log out

- **testcase_id:** `TC-AUTH-04`
- **testcase_title:** User should be able to auto-fill via practice-account buttons, log in, and log out
- **test_level:** regression
- **automated:** yes
- **precondition:** None
- **test_steps:**
  1. Click each practice-account button (one per account) and verify the fields are populated.
  2. For each login-able account (all except the Locked account), click its practice-account button, click **Login**, verify the user is logged in with that account's username shown in `[data-test="logged-in-user"]`, then click **Log out**.
- **expect_result:** Each practice-account button fills **both** the username and password fields; each login-able account logs in (redirect to home, `[data-test="logged-in-user"]` shows the correct username) and logs out (redirect back to `/login`).
- **priority:** Low
- **notes:** The Locked account is excluded from the login step — it auto-fills correctly but is expected to stay locked out (see TC-AUTH-03).

#### TC-AUTH-05 — User session should persist across a page reload

- **testcase_id:** `TC-AUTH-05`
- **testcase_title:** User session should persist across a page reload
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Reload the page (or navigate directly to a URL such as `/cart`).
- **expect_result:** The user remains logged in.
- **priority:** Medium
- **notes:** ⚠️ Currently FAILS — see BUG-006.

#### TC-AUTH-06 — User should be able to toggle password visibility

- **testcase_id:** `TC-AUTH-06`
- **testcase_title:** User should be able to toggle password visibility
- **test_level:** regression
- **automated:** yes
- **precondition:** None
- **test_steps:**
  1. Type a password, click the toggle-password-visibility button, then click it again.
- **expect_result:** The password field toggles between masked (`type=password`) and visible (`type=text`).
- **priority:** Low
- **notes:** —

---

## Gallery (Product Listing)

#### TC-GALLERY-01 — Catalog should display all items with name, price, review count, and description

- **testcase_id:** `TC-GALLERY-01`
- **testcase_title:** Catalog should display all items with name, price, review count, and description
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Navigate to `/`.
- **expect_result:** "The supply shelf" heading and "`{N}` items to explore" (where `{N}` = catalog size) are shown; each product card renders with name, price, review count, and description.
- **priority:** High
- **notes:** —

#### TC-GALLERY-02 — Search should match products case-insensitively by full name, partial name, and category name

- **testcase_id:** `TC-GALLERY-02`
- **testcase_title:** Search should match products case-insensitively by full name, partial name, and category name
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Search the **lowercase** term from the search terms; verify only the expected match is listed.
  2. Search the **uppercase** term; verify the same product is listed (case-insensitive).
  3. Search the **partial name** term (a substring of a product name); verify the expected match.
  4. Search the **category name** term; verify all products in that category are listed.
- **expect_result:** Search is case-insensitive and matches partial product names and category names, returning the correct products for each term.
- **priority:** High
- **notes:** —

#### TC-GALLERY-03 — Catalog should filter to show only the selected category's products

- **testcase_id:** `TC-GALLERY-03`
- **testcase_title:** Catalog should filter to show only the selected category's products
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Select each category in the filter in turn: "All categories", "Apparel", "Accessories", "Gear", and "Books".
  2. For each selection, verify the shown count matches the catalog.
- **expect_result:** Each category shows only its products with the correct count; "All categories" restores the full catalog.
- **priority:** High
- **notes:** —

#### TC-GALLERY-04 — Catalog should sort by name and price in both ascending and descending order

- **testcase_id:** `TC-GALLERY-04`
- **testcase_title:** Catalog should sort by name and price in both ascending and descending order
- **test_level:** sanity
- **automated:** yes
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

#### TC-GALLERY-05 — Search combined with a category filter should return only matching products

- **testcase_id:** `TC-GALLERY-05`
- **testcase_title:** Search combined with a category filter should return only matching products
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term and select a category.
- **expect_result:** Only products that match **both** the search term and the selected category are shown.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-06 — Search combined with a sort option should return matching products in order

- **testcase_id:** `TC-GALLERY-06`
- **testcase_title:** Search combined with a sort option should return matching products in order
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term and select a sort option.
- **expect_result:** The matching products are ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-07 — Category filter combined with a sort option should return the category's products in order

- **testcase_id:** `TC-GALLERY-07`
- **testcase_title:** Category filter combined with a sort option should return the category's products in order
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Select a category and a sort option.
- **expect_result:** The category's products are shown, ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-08 — Search, category, and sort combined should return only matching products in order

- **testcase_id:** `TC-GALLERY-08`
- **testcase_title:** Search, category, and sort combined should return only matching products in order
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Enter a search term, select a category, and select a sort option.
- **expect_result:** Only products matching both the search term and category are shown, ordered by the selected sort option.
- **priority:** Medium
- **notes:** —

#### TC-GALLERY-09 — Search with no matches should show an empty state that Clear filters restores

- **testcase_id:** `TC-GALLERY-09`
- **testcase_title:** Search with no matches should show an empty state that Clear filters restores
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Type `no_result_term`; verify "0 items to explore" and an empty-state message with a **Clear filters** button.
  2. Click **Clear filters**; verify the full catalog is restored.
- **expect_result:** The empty state renders correctly and Clear filters restores the full catalog.
- **priority:** Medium
- **notes:** —

---

## Product Detail Page

#### TC-PDP-01 — Clicking a product should open its detail page with full product information

- **testcase_id:** `TC-PDP-01`
- **testcase_title:** Clicking a product should open its detail page with full product information
- **test_level:** sanity
- **automated:** no
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. Click a product name/image link.
- **expect_result:** Navigates to `/product/{slug}`; shows product name, category, review count, price, and description.
- **priority:** High
- **notes:** —

#### TC-PDP-02 — Quantity controls should increment and decrement with a minimum, and Back to products should return to the catalog

- **testcase_id:** `TC-PDP-02`
- **testcase_title:** Quantity controls should increment and decrement with a minimum, and Back to products should return to the catalog
- **test_level:** regression
- **automated:** no
- **precondition:** Logged in as the Shopper account, on a product detail page.
- **test_steps:**
  1. Click "+" then "−"; verify the quantity increments/decrements with a minimum of `qty_min`.
  2. Click **Back to products**; verify return to the catalog (`/`).
- **expect_result:** Quantity clamps at the minimum; Back returns to the catalog.
- **priority:** Medium
- **notes:** —

#### TC-PDP-03 — Repeatedly clicking Add to Cart should keep adding items or show a clear dismissible error

- **testcase_id:** `TC-PDP-03`
- **testcase_title:** Repeatedly clicking Add to Cart should keep adding items or show a clear dismissible error
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account, on a product detail page.
- **test_steps:**
  1. Click **Add to Cart** 7 times for the same product.
- **expect_result:** Items continue to be added (or a clear, dismissible error).
- **priority:** Low
- **notes:** ⚠️ The 7th click triggers the "System overload" error banner and blocks further adds — see BUG-007.

---

## Cart

#### TC-CART-01 — Clicking Add to Cart should add the item and increment the cart badge

- **testcase_id:** `TC-CART-01`
- **testcase_title:** Clicking Add to Cart should add the item and increment the cart badge
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in as the Shopper account.
- **test_steps:**
  1. On the home page, click **Add to Cart** on a product card.
  2. Click the cart icon to open the cart.
- **expect_result:** The item appears in the cart, and the cart icon badge equals the total units in the cart.
- **priority:** High
- **notes:** ⚠️ Fails for one catalog product (identified in BUG-001); the rest work.

#### TC-CART-02 — Cart should correctly reflect totals, quantity changes, and item removal

- **testcase_id:** `TC-CART-02`
- **testcase_title:** Cart should correctly reflect totals, quantity changes, and item removal
- **test_level:** regression
- **automated:** yes
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

---

## Checkout

#### TC-CHECKOUT-01 — Checkout should complete through to order confirmation and clear the cart

- **testcase_id:** `TC-CHECKOUT-01`
- **testcase_title:** Checkout should complete through to order confirmation and clear the cart
- **test_level:** sanity
- **automated:** yes
- **precondition:** Logged in as the Shopper account, with items in the cart.
- **test_steps:**
  1. From the cart, click **Proceed to Checkout**; verify navigation to `/checkout`.
  2. Fill First Name / Last Name / Postal Code and click **Continue**; verify the "Order Summary" step.
  3. Click **Finish**; verify the "Order Placed!" confirmation.
  4. Click **Continue Shopping**; verify the cart badge is cleared and the cart page is empty.
- **expect_result:** The checkout completes through to confirmation; after clicking Continue Shopping, the cart is cleared.
- **priority:** High
- **notes:** —

#### TC-CHECKOUT-02 — Submitting empty required fields should show field-specific validation errors

- **testcase_id:** `TC-CHECKOUT-02`
- **testcase_title:** Submitting empty required fields should show field-specific validation errors
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account, with items in the cart, on `/checkout`.
- **test_steps:**
  1. Click **Continue** with all fields empty.
- **expect_result:** Each field shows a required-field error; the user stays on the shipping step.
- **priority:** High
- **notes:** ⚠️ Error text is wrong for First Name — see BUG-004.

#### TC-CHECKOUT-03 — Checkout totals should match the expected subtotal, tax, and total

- **testcase_id:** `TC-CHECKOUT-03`
- **testcase_title:** Checkout totals should match the expected subtotal, tax, and total
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Shopper account; cart contains `{qty}` × a product `{product}` (price `{price}`), e.g. `{qty}` = 3.
- **test_steps:**
  1. Fill First Name / Last Name / Postal Code and click **Continue** to reach the "Order Summary" step.
- **expect_result:** Subtotal = `{qty}` × `{price}`; Tax = round(`{qty}` × `{price}` × `tax_rate`, 2); Total = Subtotal + Tax.
- **priority:** Medium
- **notes:** —

#### TC-CHECKOUT-04 — The full happy path from login to order confirmation should complete with consistent totals and state

- **testcase_id:** `TC-CHECKOUT-04`
- **testcase_title:** The full happy path from login to order confirmation should complete with consistent totals and state
- **test_level:** sanity
- **automated:** yes
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

## Account-specific

#### TC-ACCOUNT-01 — Image-variation account should show product images that match their labels

- **testcase_id:** `TC-ACCOUNT-01`
- **testcase_title:** Image-variation account should show product images that match their labels
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Image-variation account.
- **test_steps:**
  1. Browse the catalog and inspect each product's image/label.
- **expect_result:** Product images/labels match their products (name, illustration, and text label are consistent).
- **priority:** Medium
- **notes:** ⚠️ Images are mismatched — see BUG-005.

#### TC-ACCOUNT-02 — Cart-badge account should show an accurate cart badge count

- **testcase_id:** `TC-ACCOUNT-02`
- **testcase_title:** Cart-badge account should show an accurate cart badge count
- **test_level:** regression
- **automated:** yes
- **precondition:** Logged in as the Cart-badge account.
- **test_steps:**
  1. Add and remove items, observing the cart badge after each change.
- **expect_result:** The cart badge always equals the number of items in the cart.
- **priority:** Medium
- **notes:** ⚠️ Badge is off by one — see BUG-003.

---

## Mobile-responsive

> A separate responsive dimension (re-versioning the full happy path at three viewports). "Responsive" means: no horizontal scrolling; key controls are visible, correctly sized, and tappable; the flow completes identically to desktop.

#### TC-MOB-01 — The full happy path should work at phone viewport (375 × 812) without horizontal scroll

- **testcase_id:** `TC-MOB-01`
- **testcase_title:** The full happy path should work at phone viewport (375 × 812) without horizontal scroll
- **test_level:** regression
- **automated:** yes
- **precondition:** None; viewport set to 375 × 812.
- **test_steps:**
  1. Open the login page and verify the form renders without horizontal scroll.
  2. Log in as the Shopper account.
  3. Verify the catalog renders without horizontal scroll.
  4. Tap **Add to Cart** on a product; verify the cart badge increments.
  5. Open the cart; verify it renders without horizontal scroll.
  6. Tap **Proceed to Checkout**; fill the shipping fields and tap **Continue**; verify the flow advances to the Order Summary.
  7. Tap **Finish**; verify the "Order Placed!" confirmation.
  8. Tap **Continue Shopping**; verify the cart is cleared.
- **expect_result:** Login, catalog, cart, checkout, and order confirmation all render without horizontal scroll; the full flow completes through order placement and the cart is cleared.
- **priority:** Medium
- **notes:** —

#### TC-MOB-02 — The full happy path should work at large phone viewport (414 × 896) without horizontal scroll

- **testcase_id:** `TC-MOB-02`
- **testcase_title:** The full happy path should work at large phone viewport (414 × 896) without horizontal scroll
- **test_level:** regression
- **automated:** yes
- **precondition:** None; viewport set to 414 × 896.
- **test_steps:**
  1. Open the login page and verify the form renders without horizontal scroll.
  2. Log in as the Shopper account.
  3. Verify the catalog renders without horizontal scroll.
  4. Tap **Add to Cart** on a product; verify the cart badge increments.
  5. Open the cart; verify it renders without horizontal scroll.
  6. Tap **Proceed to Checkout**; fill the shipping fields and tap **Continue**; verify the flow advances to the Order Summary.
  7. Tap **Finish**; verify the "Order Placed!" confirmation.
  8. Tap **Continue Shopping**; verify the cart is cleared.
- **expect_result:** Login, catalog, cart, checkout, and order confirmation all render without horizontal scroll; the full flow completes through order placement and the cart is cleared.
- **priority:** Medium
- **notes:** —

#### TC-MOB-03 — The full happy path should work at tablet viewport (768 × 1024) without horizontal scroll

- **testcase_id:** `TC-MOB-03`
- **testcase_title:** The full happy path should work at tablet viewport (768 × 1024) without horizontal scroll
- **test_level:** regression
- **automated:** yes
- **precondition:** None; viewport set to 768 × 1024.
- **test_steps:**
  1. Open the login page and verify the form renders without horizontal scroll.
  2. Log in as the Shopper account.
  3. Verify the catalog renders without horizontal scroll.
  4. Tap **Add to Cart** on a product; verify the cart badge increments.
  5. Open the cart; verify it renders without horizontal scroll.
  6. Tap **Proceed to Checkout**; fill the shipping fields and tap **Continue**; verify the flow advances to the Order Summary.
  7. Tap **Finish**; verify the "Order Placed!" confirmation.
  8. Tap **Continue Shopping**; verify the cart is cleared.
- **expect_result:** Login, catalog, cart, checkout, and order confirmation all render without horizontal scroll; the full flow completes through order placement and the cart is cleared.
- **priority:** Medium
- **notes:** —
