import { expect } from "@wdio/globals";
import { HOST, MESSAGES, PATHS, productPath, ACCOUNTS } from "../../constants/constants";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import cartPage from "../../pages/cartPage";
import productPage from "../../pages/productPage";
import { loginAs } from "../../utils/auth";
import { round2 } from "../../utils/helpers";

const hoodie = CATALOG[0]; // After Hours Hoodie — not affected by BUG-001.

describe("Shopping cart — regression", () => {
  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
  });

  it("TC-CART-02: Cart should correctly reflect totals, quantity changes, and item removal", async () => {
    // BUG-001: adding the Bolt T-Shirt from the detail page does nothing; this
    // test uses a working product to exercise the rest of the cart flow.
    const qty = 3;

    // 1. Add from the product detail page with a quantity.
    await galleryPage.actions.openProduct(hoodie.slug);
    await expect(browser).toHaveUrl(`${HOST}${productPath(hoodie.slug)}`);
    await productPage.actions.setQuantity(hoodie.slug, qty);
    await productPage.actions.addToCart(hoodie.slug);
    await expect(galleryPage.elements.cartBadge()).toHaveText(String(qty));

    // 2. Cart totals match the formula.
    await galleryPage.actions.goToCart();
    const subtotal = round2(hoodie.price * qty);
    const taxRate = await cartPage.actions.getTaxRate();
    const tax = round2(subtotal * taxRate);
    const total = round2(subtotal + tax);
    expect(round2(await cartPage.actions.getSubtotal())).toBe(subtotal);
    expect(round2(await cartPage.actions.getTax())).toBe(tax);
    expect(round2(await cartPage.actions.getTotal())).toBe(total);

    // 3. Quantity controls change the line quantity and recalculate totals.
    const id = await cartPage.actions.getCartItemId(hoodie.name);
    await cartPage.actions.increaseQuantity(id);
    await expect(cartPage.elements.qtyValue(id)).toHaveText(String(qty + 1));
    await expect(cartPage.elements.subtotal()).toHaveText(`$${round2(hoodie.price * (qty + 1)).toFixed(2)}`);
    await cartPage.actions.decreaseQuantity(id);
    await expect(cartPage.elements.qtyValue(id)).toHaveText(String(qty));

    // 4. Remove the item.
    await cartPage.actions.removeItem(id);
    expect(await cartPage.actions.getCartBadgeCount()).toBe(0);

    // 5. Empty state + Continue Shopping.
    await expect(cartPage.elements.emptyTitle()).toHaveText(MESSAGES.cartEmpty);
    await cartPage.actions.continueShoppingFromEmpty();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
  });
});
