import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest, parseCurrency, parsePercentage } from "../utils/helpers";
import { Page } from "./Page";

/** Cart page (`/cart`). */
class CartPage extends Page {
  protected readonly path = PATHS.cart;

  readonly elements = {
    checkoutButton: () => getByDataTest(DATATEST.checkoutButton),
    continueShoppingButton: () => getByDataTest(DATATEST.backToHome),
    cartBadge: () => getByDataTest(DATATEST.cartBadge),
    subtotal: () => getByDataTest(DATATEST.cartSubtotal),
    tax: () => getByDataTest(DATATEST.cartTax),
    total: () => getByDataTest(DATATEST.cartTotal),
    emptyTitle: () => getByDataTest(DATATEST.cartEmptyTitle),
    emptyMessage: () => getByDataTest(DATATEST.cartEmptyMessage),
    emptyStateContinueButton: () => getByDataTest(DATATEST.continueShopping),
    qtyDecreaseButton: (id: string) => getByDataTest(`decrease-qty-item-${id}`),
    qtyIncreaseButton: (id: string) => getByDataTest(`increase-qty-item-${id}`),
    qtyValue: (id: string) => getByDataTest(`quantity-item-${id}`),
    removeItemButton: (id: string) => getByDataTest(`remove-item-${id}`),
  };

  readonly actions = {
    increaseQuantity: async (id: string) => {
      await this.elements.qtyIncreaseButton(id).click();
    },
    decreaseQuantity: async (id: string) => {
      await this.elements.qtyDecreaseButton(id).click();
    },
    getQuantity: async (id: string) => {
      return Number(await this.elements.qtyValue(id).getText());
    },
    removeItem: async (id: string) => {
      await this.elements.removeItemButton(id).click();
    },
    // Resolve a cart line item's numeric id from its product name.
    getCartItemId: async (name: string): Promise<string> => {
      return browser.execute((productName: string): string => {
        const items = Array.from(document.querySelectorAll('[data-test="cart-item"]'));
        const item = items.find(
          (el) => el.querySelector('[data-test="cart-item-name"]')?.textContent?.trim() === productName
        );
        const inc = item?.querySelector('[data-test^="increase-qty-item-"]');
        return inc?.getAttribute("data-test")?.replace("increase-qty-item-", "") ?? "";
      }, name);
    },
    proceedToCheckout: async () => {
      await this.elements.checkoutButton().click();
    },
    continueShopping: async () => {
      await this.elements.continueShoppingButton().click();
    },
    continueShoppingFromEmpty: async () => {
      await this.elements.emptyStateContinueButton().click();
    },
    getSubtotal: async () => parseCurrency(await this.elements.subtotal().getText()),
    getTax: async () => parseCurrency(await this.elements.tax().getText()),
    getTotal: async () => parseCurrency(await this.elements.total().getText()),
    getTaxRate: async () => parsePercentage(await this.elements.tax().previousElement().getText()),
    getCartBadgeCount: async () => {
      const badge = this.elements.cartBadge();
      if (!(await badge.isExisting())) {
        return 0;
      }
      return Number(await badge.getText());
    },
    // Sum of every line item's quantity on the cart page.
    getTotalUnits: async () => {
      return browser.execute(() =>
        Array.from(document.querySelectorAll('[data-test^="quantity-item-"]'))
          .reduce((sum, el) => sum + Number(el.textContent?.trim() || 0), 0)
      );
    },
  };
}

export default new CartPage();
