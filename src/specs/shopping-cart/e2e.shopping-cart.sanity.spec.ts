import { expect } from "@wdio/globals";
import { ACCOUNTS } from "../../constants/constants";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import cartPage from "../../pages/cartPage";
import { loginAs } from "../../utils/auth";

const hoodie = CATALOG[0]; // After Hours Hoodie - unaffected by BUG-001.

describe("Shopping cart — sanity", () => {
  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
  });

  it("TC-CART-01: Clicking Add to Cart should add the item and increment the cart badge", async () => {
    // BUG-001: Bolt T-Shirt's "Add to Cart" does nothing (see docs/bugs.md),
    // so this happy path uses a product unaffected by the bug.
    await galleryPage.actions.addToCart(hoodie.slug);
    await galleryPage.actions.goToCart();

    // The item should be in the cart, and the cart icon should match the cart contents.
    const totalUnits = await cartPage.actions.getTotalUnits();
    const badgeCount = await cartPage.actions.getCartBadgeCount();

    expect(totalUnits).toBe(1);
    expect(badgeCount).toBe(totalUnits); // badge must equal total units in cart
  });
});
