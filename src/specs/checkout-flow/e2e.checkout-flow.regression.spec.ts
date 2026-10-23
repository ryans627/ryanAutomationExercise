import { expect } from "@wdio/globals";
import { HOST, MESSAGES, PATHS } from "../../constants/constants";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import cartPage from "../../pages/cartPage";
import checkoutPage from "../../pages/checkoutPage";
import { loginAsShopper } from "../../utils/auth";
import { round2 } from "../../utils/helpers";

const hoodie = CATALOG[0]; // After Hours Hoodie
const shippingInfo = { firstName: "Ada", lastName: "Lovelace", postalCode: "94016" };

describe("Checkout — regression", () => {
  beforeEach(async () => {
    await loginAsShopper();
  });

  it("TC-CHECKOUT-02: Submitting empty required fields should show field-specific validation errors", async () => {
    await galleryPage.actions.addToCart(hoodie.slug);
    await galleryPage.actions.goToCart();
    await cartPage.actions.proceedToCheckout();

    await checkoutPage.actions.continueToSummary();

    await expect(browser).toHaveUrl(`${HOST}${PATHS.checkout}`);
    await expect(checkoutPage.elements.firstNameError()).toBeDisplayed();
    await expect(checkoutPage.elements.lastNameError()).toBeDisplayed();
    await expect(checkoutPage.elements.postalCodeError()).toBeDisplayed();

    await expect(checkoutPage.elements.lastNameError()).toHaveText(MESSAGES.lastNameRequired);
    await expect(checkoutPage.elements.postalCodeError()).toHaveText(MESSAGES.postalCodeRequired);
    // BUG-004: First Name shows "Last Name is required" instead of "First Name is required".
  });

  it("TC-CHECKOUT-03: Checkout totals should match the expected subtotal, tax, and total", async () => {
    const qty = 3;
    await galleryPage.actions.addToCart(hoodie.slug, qty);
    await galleryPage.actions.goToCart();
    await cartPage.actions.proceedToCheckout();

    await checkoutPage.actions.fillShippingInfo(shippingInfo);
    await checkoutPage.actions.continueToSummary();

    const subtotal = round2(hoodie.price * qty);
    const taxRate = await checkoutPage.actions.getTaxRate();
    const tax = round2(subtotal * taxRate);
    const total = round2(subtotal + tax);

    expect(round2(await checkoutPage.actions.getSubtotal())).toBe(subtotal);
    expect(round2(await checkoutPage.actions.getTax())).toBe(tax);
    expect(round2(await checkoutPage.actions.getTotal())).toBe(total);
  });
});
