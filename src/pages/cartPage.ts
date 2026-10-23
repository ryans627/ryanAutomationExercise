import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest, parseCurrency, parsePercentage } from "../utils/helpers";
import { Page } from "./Page";

/** Cart page (`/cart`). */
class CartPage extends Page {
  protected readonly path = PATHS.cart;

  readonly elements = {
    checkoutButton: () => getByDataTest(DATATEST.checkoutButton),
    continueShoppingButton: () => getByDataTest(DATATEST.backToHome),
    subtotal: () => getByDataTest(DATATEST.cartSubtotal),
    tax: () => getByDataTest(DATATEST.cartTax),
    total: () => getByDataTest(DATATEST.cartTotal),
    emptyTitle: () => getByDataTest(DATATEST.cartEmptyTitle),
    emptyMessage: () => getByDataTest(DATATEST.cartEmptyMessage),
    emptyStateContinueButton: () => getByDataTest(DATATEST.continueShopping),
    qtyDecreaseButton: (id: string) => getByDataTest(`${DATATEST.decreaseQtyItemPrefix}${id}`),
    qtyIncreaseButton: (id: string) => getByDataTest(`${DATATEST.increaseQtyItemPrefix}${id}`),
    qtyValue: (id: string) => getByDataTest(`${DATATEST.quantityItemPrefix}${id}`),
    removeItemButton: (id: string) => getByDataTest(`${DATATEST.removeItemPrefix}${id}`),
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
      return browser.execute(
        (productName: string, cartItem: string, cartItemName: string, increaseQtyItemPrefix: string): string => {
          const items = Array.from(document.querySelectorAll(`[data-test="${cartItem}"]`));
          const item = items.find(
            (el) => el.querySelector(`[data-test="${cartItemName}"]`)?.textContent?.trim() === productName
          );
          const inc = item?.querySelector(`[data-test^="${increaseQtyItemPrefix}"]`);
          return inc?.getAttribute("data-test")?.replace(increaseQtyItemPrefix, "") ?? "";
        },
        name,
        DATATEST.cartItem,
        DATATEST.cartItemName,
        DATATEST.increaseQtyItemPrefix
      );
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
    // The tax rate is shown in the label next to the tax value ("Tax (8%)");
    // the label is the tax value's previous sibling in the app markup.
    getTaxRate: async () => parsePercentage(await this.elements.tax().previousElement().getText()),
    // Sum of every line item's quantity on the cart page.
    getTotalUnits: async () => {
      return browser.execute(
        (quantityItemPrefix: string) =>
          Array.from(document.querySelectorAll(`[data-test^="${quantityItemPrefix}"]`)).reduce(
            (sum, el) => sum + Number(el.textContent?.trim() || 0),
            0
          ),
        DATATEST.quantityItemPrefix
      );
    },
  };
}

export default new CartPage();
