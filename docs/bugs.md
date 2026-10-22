# Bug Tickets — Morrow Supply

Bugs discovered during QA. Test cases reference these by `BUG-xxx`. Environment: https://qa-task--oyettijon.replit.app/ (all accounts).

---

### BUG-001 — "Add to Cart" does nothing for Bolt T-Shirt

| Field | Detail |
| --- | --- |
| Severity | High |
| Priority | High |
| Status | Open |
| Affected test case | TC-CART-SANITY-01, TC-CART-E2E-01 |
| Screenshot | [bolt-tshirt-add-broken.png](screenshots/bolt-tshirt-add-broken.png) |

**Steps to reproduce:**
1. Log in as the Shopper account (`fern_signal`).
2. On the catalog, click **Add to Cart** for **Bolt T-Shirt** (`[data-test="add-to-cart-bolt-t-shirt"]`), or open the product and click **Add to Cart** there.
3. Observe the cart badge.

**Expected result:** The button shows "Added!", the cart badge increments, and the item appears in the cart.

**Actual result:** Nothing happens — no item is added and the badge does not change.

**Notes:** The other 11 products work correctly.

---

### BUG-002 — Sort by price (high → low) sorts ascending

| Field | Detail |
| --- | --- |
| Severity | Medium |
| Priority | Medium |
| Status | Open |
| Affected test case | TC-GALLERY-SANITY-04 |
| Screenshot | [sort-high-to-low-bug.png](screenshots/sort-high-to-low-bug.png) |

**Steps to reproduce:**
1. Log in as the Shopper account.
2. On the catalog, select `price-high` in `[data-test="sort-select"]`.

**Expected result:** Products are ordered by descending price (highest first).

**Actual result:** Products are ordered ascending (same as `price-low`).

**Notes:** `price-low` works correctly.

---

### BUG-003 — Cart badge is off by one for the cart-badge account

| Field | Detail |
| --- | --- |
| Severity | Medium |
| Priority | Medium |
| Status | Open |
| Affected test case | TC-ACCOUNT-E2E-02 |
| Screenshot | [cart-badge-bug.png](screenshots/cart-badge-bug.png) |

**Steps to reproduce:**
1. Log in as the Cart-badge account (`count_echo`).
2. Add items to the cart, then remove items, observing the badge after each change.

**Expected result:** The badge count always equals the actual number of items in the cart.

**Actual result:** The badge always shows one more than the actual item count — e.g. "1" when the cart is empty, "2" with one item.

**Notes:** Also manifests after checkout: for `count_echo`, after clicking **Continue Shopping** the cart is empty but the badge still shows "1". This is the same off-by-one badge bug, not a separate cart-clearing issue.

---

### BUG-004 — Checkout required-field error text is wrong for First Name

| Field | Detail |
| --- | --- |
| Severity | Low |
| Priority | Low |
| Status | Open |
| Affected test case | TC-CHECKOUT-E2E-01 |
| Screenshot | [checkout-empty-error.png](screenshots/checkout-empty-error.png) |

**Steps to reproduce:**
1. Log in as the Shopper account with items in the cart.
2. On `/checkout`, click **Continue** with all fields empty.

**Expected result:** Each required field shows a correct, field-specific error message.

**Actual result:** The First Name field shows "Last Name is required" instead of "First Name is required".

**Notes:** Record the actual vs. expected error text for First Name (screenshot).

---

### BUG-005 — Product images are mismatched for the image-variation account

| Field | Detail |
| --- | --- |
| Severity | Medium |
| Priority | Medium |
| Status | Open |
| Affected test case | TC-ACCOUNT-E2E-01 |
| Screenshot | [image-variation-home.png](screenshots/image-variation-home.png), [socks-detail-lens-warp.png](screenshots/socks-detail-lens-warp.png) |

**Steps to reproduce:**
1. Log in as the Image-variation account (`lens_warp`).
2. Browse the catalog and inspect each product's image and text label.

**Expected result:** Each product image/illustration and text label match the product name.

**Actual result:** One or more product images are mismatched (image does not match the product name/label).

**Notes:** List the exact mismatched products and attach screenshots. Confirm whether the same mismatch appears for the Shopper account.

---

### BUG-006 — Session is lost across a page reload

| Field | Detail |
| --- | --- |
| Severity | High |
| Priority | High |
| Status | Open |
| Affected test case | TC-AUTH-E2E-03 |
| Screenshot | [login-page.png](screenshots/login-page.png) |

**Steps to reproduce:**
1. Log in as the Shopper account.
2. Reload the page (or navigate directly to a URL such as `/cart`).

**Expected result:** The user remains logged in.

**Actual result:** The user is logged out.

**Notes:** Note whether this reproduces on all accounts or only some.

---

### BUG-007 — 7th "Add to Cart" triggers "System overload" and blocks further adds

| Field | Detail |
| --- | --- |
| Severity | Medium |
| Priority | Medium |
| Status | Open |
| Affected test case | TC-PDP-E2E-02 |
| Screenshot | [overload-error-banner.png](screenshots/overload-error-banner.png) |

**Steps to reproduce:**
1. Log in as the Shopper account.
2. Open a product detail page.
3. Click **Add to Cart** 7 times for the same product.

**Expected result:** Items continue to be added (or a clear, dismissible error is shown).

**Actual result:** The 7th click triggers a "System overload" error banner — *"Error: System overload — item interaction limit exceeded for this session. Please refresh the page to continue."* — that blocks all further clicks until dismissed.

**Notes:** The banner is a full-width fixed overlay with a dismiss (×) button. Confirm whether the interaction limit resets after dismissing the banner vs. requiring a full reload.
