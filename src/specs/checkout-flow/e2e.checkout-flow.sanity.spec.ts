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

describe("Checkout — sanity", () => {
  beforeEach(async () => {
    await loginAsShopper();
  });

  it("TC-CHECKOUT-01: Checkout should complete through to order confirmation and clear the cart", async () => {
    await galleryPage.actions.addToCart(hoodie.slug);
    await galleryPage.actions.goToCart();

    await cartPage.actions.proceedToCheckout();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.checkout}`);

    await checkoutPage.actions.fillShippingInfo(shippingInfo);
    await checkoutPage.actions.continueToSummary();
    await expect(checkoutPage.elements.finishButton()).toBeDisplayed();

    await checkoutPage.actions.finish();
    await expect(checkoutPage.elements.successTitle()).toHaveText(MESSAGES.orderPlaced);

    await cartPage.actions.continueShopping();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
    expect(await cartPage.actions.getCartBadgeCount()).toBe(0);

    await galleryPage.actions.goToCart();
    await expect(cartPage.elements.emptyTitle()).toHaveText(MESSAGES.cartEmpty);
  });

  it("TC-CHECKOUT-04: The full happy path from login to order confirmation should complete with consistent totals and state", async () => {
    expect(await galleryPage.actions.getProductCount()).toBe(CATALOG.length);

    const bottom = CATALOG[CATALOG.length - 1];
    await galleryPage.actions.addToCart(hoodie.slug);
    await galleryPage.actions.addToCart(bottom.slug);
    await galleryPage.actions.goToCart();

    const taxRate = await cartPage.actions.getTaxRate();
    const subtotal = round2(hoodie.price + bottom.price);
    const tax = round2(subtotal * taxRate);
    const total = round2(subtotal + tax);

    expect(round2(await cartPage.actions.getSubtotal())).toBe(subtotal);
    expect(round2(await cartPage.actions.getTax())).toBe(tax);
    expect(round2(await cartPage.actions.getTotal())).toBe(total);

    // Adjust quantity: increase the hoodie to 2, then verify totals recalculate.
    const hoodieId = await cartPage.actions.getCartItemId(hoodie.name);
    await cartPage.actions.increaseQuantity(hoodieId);
    await browser.pause(400);

    const adjustedSubtotal = round2(2 * hoodie.price + bottom.price);
    const adjustedTax = round2(adjustedSubtotal * taxRate);
    const adjustedTotal = round2(adjustedSubtotal + adjustedTax);

    expect(round2(await cartPage.actions.getSubtotal())).toBe(adjustedSubtotal);
    expect(round2(await cartPage.actions.getTax())).toBe(adjustedTax);
    expect(round2(await cartPage.actions.getTotal())).toBe(adjustedTotal);

    await cartPage.actions.proceedToCheckout();
    await checkoutPage.actions.fillShippingInfo(shippingInfo);
    await checkoutPage.actions.continueToSummary();

    expect(round2(await checkoutPage.actions.getSubtotal())).toBe(adjustedSubtotal);
    expect(round2(await checkoutPage.actions.getTotal())).toBe(adjustedTotal);

    await checkoutPage.actions.finish();
    await expect(checkoutPage.elements.successTitle()).toHaveText(MESSAGES.orderPlaced);

    await cartPage.actions.continueShopping();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
    expect(await cartPage.actions.getCartBadgeCount()).toBe(0);
  });
});
