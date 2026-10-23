import { expect } from "@wdio/globals";
import { HOST, MESSAGES, PATHS, ACCOUNTS } from "../../constants/constants";
import { CATALOG, SHIPPING_INFO } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import cartPage from "../../pages/cartPage";
import checkoutPage from "../../pages/checkoutPage";
import { loginAs } from "../../utils/auth";
import { computeTotals, round2 } from "../../utils/helpers";

const hoodie = CATALOG[0]; // After Hours Hoodie

describe("Checkout — sanity", () => {
  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
  });

  it("TC-CHECKOUT-01: Checkout should complete through to order confirmation and clear the cart", async () => {
    await galleryPage.actions.addToCart(hoodie.slug);
    await galleryPage.actions.goToCart();

    await cartPage.actions.proceedToCheckout();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.checkout}`);

    await checkoutPage.actions.fillShippingInfo(SHIPPING_INFO);
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
    const { tax, total } = computeTotals(subtotal, taxRate);

    expect(round2(await cartPage.actions.getSubtotal())).toBe(subtotal);
    expect(round2(await cartPage.actions.getTax())).toBe(tax);
    expect(round2(await cartPage.actions.getTotal())).toBe(total);

    // Adjust quantity: increase the hoodie to 2, then verify totals recalculate.
    const hoodieId = await cartPage.actions.getCartItemId(hoodie.name);
    await cartPage.actions.increaseQuantity(hoodieId);

    const adjustedSubtotal = round2(2 * hoodie.price + bottom.price);
    const { tax: adjustedTax, total: adjustedTotal } = computeTotals(adjustedSubtotal, taxRate);

    await expect(cartPage.elements.subtotal()).toHaveText(`$${adjustedSubtotal.toFixed(2)}`);
    await expect(cartPage.elements.tax()).toHaveText(`$${adjustedTax.toFixed(2)}`);
    await expect(cartPage.elements.total()).toHaveText(`$${adjustedTotal.toFixed(2)}`);

    await cartPage.actions.proceedToCheckout();
    await checkoutPage.actions.fillShippingInfo(SHIPPING_INFO);
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
