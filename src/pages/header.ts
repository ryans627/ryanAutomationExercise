import { DATATEST } from "../constants/constants";
import { getByDataTest } from "../utils/helpers";

/**
 * The shared site header, present on every authenticated page. It owns the
 * Shop link, the cart icon + its badge, the signed-in username, and the Logout
 * link — none of which belong to a single page.
 *
 * Unlike the page objects, this is a component rather than a page: it has no
 * `path` and is never navigated to directly, so it does not extend {@link Page}.
 */
class Header {
  readonly elements = {
    shopLink: () => getByDataTest(DATATEST.navInventory),
    cartLink: () => getByDataTest(DATATEST.navCart),
    cartBadge: () => getByDataTest(DATATEST.cartBadge),
    loggedInUser: () => getByDataTest(DATATEST.loggedInUser),
    logoutButton: () => getByDataTest(DATATEST.logoutButton),
  };

  readonly actions = {
    goToShop: async () => {
      await this.elements.shopLink().click();
    },
    goToCart: async () => {
      await this.elements.cartLink().click();
    },
    logout: async () => {
      await this.elements.logoutButton().click();
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

export default new Header();
