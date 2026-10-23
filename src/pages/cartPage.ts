import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest } from "../utils/helpers";
import { Page } from "./Page";

/** Cart page (`/cart`). */
class CartPage extends Page {
  protected readonly path = PATHS.cart;

  readonly elements = {
    checkoutButton: () => getByDataTest(DATATEST.checkoutButton),
    continueShoppingButton: () => getByDataTest(DATATEST.backToHome),
    cartBadge: () => getByDataTest(DATATEST.cartBadge),
    qtyDecreaseButton: (slug: string) => getByDataTest(`qty-decrease-${slug}`),
    qtyIncreaseButton: (slug: string) => getByDataTest(`qty-increase-${slug}`),
    qtyValue: (slug: string) => getByDataTest(`qty-value-${slug}`),
    removeItemButton: (id: string) => getByDataTest(`remove-item-${id}`),
  };

  readonly actions = {
    increaseQuantity: async (slug: string) => {
      await this.elements.qtyIncreaseButton(slug).click();
    },
    decreaseQuantity: async (slug: string) => {
      await this.elements.qtyDecreaseButton(slug).click();
    },
    getQuantity: async (slug: string) => {
      return Number(await this.elements.qtyValue(slug).getText());
    },
    removeItem: async (id: string) => {
      await this.elements.removeItemButton(id).click();
    },
    proceedToCheckout: async () => {
      await this.elements.checkoutButton().click();
    },
    continueShopping: async () => {
      await this.elements.continueShoppingButton().click();
    },
    getCartBadgeCount: async () => {
      const badge = this.elements.cartBadge();
      if (!(await badge.isExisting())) {
        return 0;
      }
      return Number(await badge.getText());
    },
  };
}

export default new CartPage();
