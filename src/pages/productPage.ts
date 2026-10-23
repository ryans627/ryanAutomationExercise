import { DATATEST, HOST, PATHS, productPath } from "../constants/constants";
import { getByDataTest } from "../utils/helpers";
import { Page } from "./Page";

/** Product detail page (`/product/{slug}`). */
class ProductPage extends Page {
  protected readonly path = PATHS.product;

  readonly elements = {
    backToProductsButton: () => getByDataTest(DATATEST.backToInventoryLink),
    addToCartButton: (slug: string) => getByDataTest(`add-to-cart-${slug}`),
    qtyDecreaseButton: (slug: string) => getByDataTest(`qty-decrease-${slug}`),
    qtyIncreaseButton: (slug: string) => getByDataTest(`qty-increase-${slug}`),
    qtyValue: (slug: string) => getByDataTest(`qty-value-${slug}`),
  };

  readonly actions = {
    addToCart: async (slug: string) => {
      await this.elements.addToCartButton(slug).click();
    },
    increaseQuantity: async (slug: string) => {
      await this.elements.qtyIncreaseButton(slug).click();
    },
    decreaseQuantity: async (slug: string) => {
      await this.elements.qtyDecreaseButton(slug).click();
    },
    getQuantity: async (slug: string) => {
      return Number(await this.elements.qtyValue(slug).getText());
    },
    backToProducts: async () => {
      await this.elements.backToProductsButton().click();
    },
  };

  // A slug is required in practice; the default only keeps the override
  // signature compatible with the base `navigate()`.
  async navigate(slug = ""): Promise<void> {
    await browser.url(`${HOST}${productPath(slug)}`);
  }
}

export default new ProductPage();
