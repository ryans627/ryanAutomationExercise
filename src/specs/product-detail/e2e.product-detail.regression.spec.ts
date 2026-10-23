import { expect } from "@wdio/globals";
import { ACCOUNTS } from "../../constants/constants";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import header from "../../pages/header";
import productPage from "../../pages/productPage";
import { loginAs } from "../../utils/auth";

const hoodie = CATALOG[0]; // After Hours Hoodie

describe("Product detail — regression", () => {
  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
  });

  it.skip("TC-PDP-03: Repeatedly clicking Add to Cart should keep adding items or show a clear dismissible error", async () => {
    // Known failure: BUG-007 — the 7th click triggers the "System overload" banner
    // and blocks the add, so the badge stays at 6.
    await galleryPage.actions.openProduct(hoodie.slug);
    await productPage.actions.addToCart(hoodie.slug, 7);

    expect(await header.actions.getCartBadgeCount()).toBe(7);
  });
});
