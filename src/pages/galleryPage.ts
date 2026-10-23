import { DATATEST, PATHS } from "../constants/constants";
import { getAllByDataTest, getByDataTest } from "../utils/helpers";
import { Page } from "./Page";

/**
 * The catalog / home page (`/`). Also hosts the shared header (nav + cart badge)
 * used across the authenticated pages.
 */
class GalleryPage extends Page {
  protected readonly path = PATHS.home;

  readonly elements = {
    searchBox: () => getByDataTest(DATATEST.searchProducts),
    clearFiltersButton: () => getByDataTest(DATATEST.clearFilters),
    categoryFilter: () => getByDataTest(DATATEST.filterCategory),
    sortSelect: () => getByDataTest(DATATEST.sortSelect),
    cartBadge: () => getByDataTest(DATATEST.cartBadge),
    navCart: () => getByDataTest(DATATEST.navCart),
    navShop: () => getByDataTest(DATATEST.navInventory),
    productNameLinks: () => getAllByDataTest(DATATEST.inventoryItemName),
    inventoryTitle: () => getByDataTest(DATATEST.inventoryTitle),
    addToCartButton: (slug: string) => getByDataTest(`add-to-cart-${slug}`),
  };

  readonly actions = {
    search: async (term: string) => {
      await this.elements.searchBox().clearValue();
      await this.elements.searchBox().setValue(term);
    },
    clearFilters: async () => {
      await this.elements.clearFiltersButton().click();
    },
    // Assumes the category <select> option text matches the category name
    // ("Apparel", "Accessories", ...). Values are not documented in testData.ts.
    selectCategory: async (category: string) => {
      await this.elements.categoryFilter().selectByVisibleText(category);
    },
    selectSort: async (optionValue: string) => {
      await this.elements.sortSelect().selectByAttribute("value", optionValue);
    },
    addToCart: async (slug: string, qty = 1) => {
      for (let i = 0; i < qty; i++) {
        await this.elements.addToCartButton(slug).click();
        if (i < qty - 1) await browser.pause(400);
      }
    },
    goToCart: async () => {
      await this.elements.navCart().click();
    },
    goToShop: async () => {
      await this.elements.navShop().click();
    },
    getCartBadgeCount: async () => {
      const badge = this.elements.cartBadge();
      if (!(await badge.isExisting())) {
        return 0;
      }
      return Number(await badge.getText());
    },
    getProductCount: async () => (await this.elements.productNameLinks()).length,
    getProductNames: async () => {
      const links = await this.elements.productNameLinks();
      return Promise.all([...links].map((l) => l.getText()));
    },
  };
}

export default new GalleryPage();
