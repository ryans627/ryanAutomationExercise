import { expect } from "@wdio/globals";
import { HOST, MESSAGES, PATHS, ACCOUNTS } from "../../constants/constants";
import { CATALOG, SHIPPING_INFO } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import header from "../../pages/header";
import cartPage from "../../pages/cartPage";
import checkoutPage from "../../pages/checkoutPage";
import { loginAs } from "../../utils/auth";
import { computeTotals, round2 } from "../../utils/helpers";

const hoodie = CATALOG[0]; // After Hours Hoodie

describe("Checkout — regression", () => {
  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
  });

  it("TC-CHECKOUT-02: Submitting empty required fields should show field-specific validation errors", async () => {
    await galleryPage.actions.addToCart(hoodie.slug);
    await header.actions.goToCart();
    await cartPage.actions.proceedToCheckout();

    await checkoutPage.actions.continueToSummary();

    await expect(browser).toHaveUrl(`${HOST}${PATHS.checkout}`);
    await expect(checkoutPage.elements.firstNameError()).toBeDisplayed();
    await expect(checkoutPage.elements.lastNameError()).toBeDisplayed();
    await expect(checkoutPage.elements.postalCodeError()).toBeDisplayed();

    await expect(checkoutPage.elements.lastNameError()).toHaveText(MESSAGES.lastNameRequired);
    await expect(checkoutPage.elements.postalCodeError()).toHaveText(MESSAGES.postalCodeRequired);
    // BUG-004: First Name shows "Last Name is required" instead of "First Name is required".
    // await expect(checkoutPage.elements.firstNameError()).toHaveText(MESSAGES.firstNameRequired);
  });

  it("TC-CHECKOUT-03: Checkout totals should match the expected subtotal, tax, and total", async () => {
    const qty = 3;
    await galleryPage.actions.addToCart(hoodie.slug, qty);
    await header.actions.goToCart();
    await cartPage.actions.proceedToCheckout();

    await checkoutPage.actions.fillShippingInfo(SHIPPING_INFO);
    await checkoutPage.actions.continueToSummary();

    const subtotal = round2(hoodie.price * qty);
    const taxRate = await checkoutPage.actions.getTaxRate();
    const { tax, total } = computeTotals(subtotal, taxRate);

    expect(round2(await checkoutPage.actions.getSubtotal())).toBe(subtotal);
    expect(round2(await checkoutPage.actions.getTax())).toBe(tax);
    expect(round2(await checkoutPage.actions.getTotal())).toBe(total);
  });
});
