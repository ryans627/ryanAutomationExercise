import { getCaseInsensitiveMsg } from "../utils/helpers";

/**
 * Static constants for the app under test ("Morrow Supply").
 * Keep in sync with the app under test — do not hardcode these strings in page objects.
 */

/** Base URL. */
export const HOST = "https://qa-task--oyettijon.replit.app";

/** URL paths, relative to {@link HOST}. */
export const PATHS = {
  home: "/",
  login: "/login",
  cart: "/cart",
  checkout: "/checkout",
  product: "/product",
} as const;

/** Build the product detail path for a catalog slug, e.g. `/product/bolt-t-shirt`. */
export function productPath(slug: string): string {
  return `${PATHS.product}/${slug}`;
}

/** `data-test` attribute values. */
export const DATATEST = {
  username: "username",
  password: "password",
  togglePasswordVisibility: "toggle-password-visibility",
  loginButton: "login-button",
  loginErrorMessage: "login-error-message",
  navInventory: "nav-inventory",
  navCart: "nav-cart",
  cartBadge: "cart-badge",
  logoutButton: "logout-button",
  loggedInUser: "logged-in-user",
  searchProducts: "search-products",
  clearFilters: "clear-filters",
  filterCategory: "filter-category",
  sortSelect: "sort-select",
  inventoryItemName: "inventory-item-name",
  inventoryTitle: "inventory-title",
  backToInventoryLink: "back-to-inventory-link",
  checkoutFirstName: "checkout-first-name",
  checkoutLastName: "checkout-last-name",
  checkoutPostalCode: "checkout-postal-code",
  continueToSummary: "continue-to-summary",
  checkoutButton: "checkout-button",
  finishButton: "finish-button",
  backToHome: "back-to-home",
  cartSubtotal: "cart-subtotal",
  cartTax: "cart-tax",
  cartTotal: "cart-total",
  cartEmptyTitle: "cart-empty-title",
  cartEmptyMessage: "cart-empty-message",
  firstNameError: "first-name-error",
  lastNameError: "last-name-error",
  postalCodeError: "postal-code-error",
  checkoutSubtotal: "checkout-subtotal",
  checkoutTax: "checkout-tax",
  checkoutTotal: "checkout-total",
  checkoutItemName: "checkout-item-name",
  checkoutItemQty: "checkout-item-qty",
  checkoutItemSubtotal: "checkout-item-subtotal",
  shippingInfo: "shipping-info",
  checkoutSuccessTitle: "checkout-success-title",
  checkoutSuccessMessage: "checkout-success-message",
} as const;

/** Test accounts. */
export const ACCOUNTS = {
  shopper: "fern_signal",
  locked: "quiet_lock",
  imageVariation: "lens_warp",
  cartBadge: "count_echo",
} as const;

/** Shared password for all test accounts. */
export const PASSWORD = "test_sauce";

/** User-facing text messages asserted in tests. */
export const MESSAGES = {
  usernameRequired: getCaseInsensitiveMsg("Username is required"),
  passwordRequired: getCaseInsensitiveMsg("Password is required"),
  invalidCredentials: getCaseInsensitiveMsg("Username and password do not match any user in this service"),
  lockedOut: getCaseInsensitiveMsg("Sorry, this user has been locked out"),
  lastNameRequired: getCaseInsensitiveMsg("Last Name is required"),
  postalCodeRequired: getCaseInsensitiveMsg("Postal Code is required"),
  orderPlaced: getCaseInsensitiveMsg("Order Placed!"),
  cartEmpty: getCaseInsensitiveMsg("Your cart is empty"),
} as const;
