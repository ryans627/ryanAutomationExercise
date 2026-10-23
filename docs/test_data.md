# Test Data — Morrow Supply

Reference data for the test cases in [`testcases.md`](testcases.md). Automation should consume this file rather than hardcoding values inside test bodies. Treat all values below as **mutable** — update them here and the test cases remain valid.

## Accounts

| Role | Username | Password | Purpose |
| --- | --- | --- | --- |
| Shopper | `fern_signal` | `test_sauce` | Normal shopping flow |
| Locked account | `quiet_lock` | `test_sauce` | Locked-out login scenario |
| Image-variation account | `lens_warp` | `test_sauce` | Product image correctness |
| Cart-badge account | `count_echo` | `test_sauce` | Cart badge count correctness |

> Password for all accounts: `test_sauce`.

## Constants

| Constant | Value | Used by |
| --- | --- | --- |
| `tax_rate` | `0.08` (8%) | Cart / checkout total calculations |
| `qty_min` | `1` | Quantity controls |
| `qty_max` | `99` | Quantity controls |
| `mobile_viewport` | `375 × 812` (iPhone) | Mobile-responsive tests |

## Search terms

| Term | Type | Expected match |
| --- | --- | --- |
| `hoodie` | lowercase | After Hours Hoodie |
| `HOODIE` | uppercase | After Hours Hoodie (case-insensitive) |
| `hood` | partial name | After Hours Hoodie |
| `apparel` | category name | All Apparel products |
| `zzzz` | no match | None (empty state) |

## Sort options (`sort-select` values)

| Sort option (label) | Value |
| --- | --- |
| Name: A to Z | `name-az` |
| Name: Z to A | `name-za` |
| Price: Low to High | `price-low` |
| Price: High to Low | `price-high` |

## Key selectors (for automation)

| Element | Selector |
| --- | --- |
| Username input | `[data-test="username"]` |
| Password input | `[data-test="password"]` |
| Toggle password visibility | `[data-test="toggle-password-visibility"]` |
| Login button | `[data-test="login-button"]` |
| Login error | `[data-test="login-error-message"]` |
| Practice-account button (fills credentials) | `[data-test="hint-user-{username}"]` |
| Nav → Shop | `[data-test="nav-inventory"]` |
| Nav → Cart | `[data-test="nav-cart"]` |
| Cart badge count | `[data-test="cart-badge"]` |
| Logout | `[data-test="logout-button"]` |
| Logged-in username | `[data-test="logged-in-user"]` |
| Search box | `[data-test="search-products"]` |
| Clear filters | `[data-test="clear-filters"]` |
| Category filter | `[data-test="filter-category"]` |
| Sort select | `[data-test="sort-select"]` |
| Product name link | `[data-test="inventory-item-name"]` |
| Product "Add to Cart" | `[data-test="add-to-cart-{slug}"]` |
| Qty decrease (card) | `[data-test="qty-decrease-{slug}"]` |
| Qty increase (card) | `[data-test="qty-increase-{slug}"]` |
| Qty value (card) | `[data-test="qty-value-{slug}"]` |
| Back to products | `[data-test="back-to-inventory-link"]` |
| Checkout first name | `[data-test="checkout-first-name"]` |
| Checkout last name | `[data-test="checkout-last-name"]` |
| Checkout postal code | `[data-test="checkout-postal-code"]` |
| Checkout continue | `[data-test="continue-to-summary"]` |
| Proceed to Checkout | `[data-test="checkout-button"]` |
| Finish | `[data-test="finish-button"]` |
| Continue Shopping | `[data-test="back-to-home"]` |
| Cart remove item | `[data-test="remove-item-{id}"]` |

## Product catalog

| Product | Price | URL slug | Category |
| --- | --- | --- | --- |
| After Hours Hoodie | $44.99 | sauce-labs-hoodie | Apparel |
| Bolt T-Shirt | $15.99 | bolt-t-shirt | Apparel |
| Branch Point Decals | $4.99 | qa-sticker-pack | Accessories |
| Bug Hunt Crew Socks | $8.99 | debug-socks | Accessories |
| Daybreak Ceramic Mug | $14.99 | sauce-labs-mug | Accessories |
| Gridline Journal | $12.99 | lab-notebook | Accessories |
| Little Trek Bodysuit | $7.99 | onesie | Apparel |
| Nightline Safety Light | $9.99 | bike-light | Gear |
| Side Quest Tee | $15.99 | all-the-things-t-shirt | Apparel |
| Signal Path Field Guide | $24.99 | automation-handbook | Books |
| Summit Fleece | $49.99 | fleece-jacket | Apparel |
| Trailmark Day Pack | $29.99 | backpack | Gear |

> Category counts (derived, for filter assertions): Apparel = 5, Accessories = 4, Gear = 2, Books = 1, Total = 12.
