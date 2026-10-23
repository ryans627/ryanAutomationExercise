import { expect } from "@wdio/globals";
import { ACCOUNTS, HOST, MESSAGES, PASSWORD, PATHS } from "../../constants/constants";
import { CATALOG, SHIPPING_INFO } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import cartPage from "../../pages/cartPage";
import checkoutPage from "../../pages/checkoutPage";
import loginPage from "../../pages/loginPage";

const hoodie = CATALOG[0];

const VIEWPORTS = {
  phone: { width: 375, height: 812 },
  largePhone: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
};

describe("Mobile — regression", () => {
  it("TC-MOB-01: The full happy path should work at phone viewport (375 × 812) without horizontal scroll", async () => {
    await runResponsiveFlow(VIEWPORTS.phone.width, VIEWPORTS.phone.height);
  });

  it("TC-MOB-02: The full happy path should work at large phone viewport (414 × 896) without horizontal scroll", async () => {
    await runResponsiveFlow(VIEWPORTS.largePhone.width, VIEWPORTS.largePhone.height);
  });

  it("TC-MOB-03: The full happy path should work at tablet viewport (768 × 1024) without horizontal scroll", async () => {
    await runResponsiveFlow(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height);
  });
});

const assertNoHorizontalScroll = async () => {
  const fits = await browser.execute(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(fits).toBe(true);
};

const runResponsiveFlow = async (width: number, height: number) => {
  await browser.setWindowSize(width, height);

  await loginPage.navigate();
  await assertNoHorizontalScroll();

  await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });
  await loginPage.elements.logoutButton().waitForDisplayed();
  await assertNoHorizontalScroll();
  expect(await galleryPage.actions.getProductCount()).toBe(CATALOG.length);

  await galleryPage.actions.addToCart(hoodie.slug);
  await assertNoHorizontalScroll();

  await galleryPage.actions.goToCart();
  await assertNoHorizontalScroll();

  await cartPage.actions.proceedToCheckout();
  await expect(browser).toHaveUrl(`${HOST}${PATHS.checkout}`);
  await assertNoHorizontalScroll();

  await checkoutPage.actions.fillShippingInfo(SHIPPING_INFO);
  await checkoutPage.actions.continueToSummary();
  await expect(checkoutPage.elements.finishButton()).toBeDisplayed();
  await assertNoHorizontalScroll();

  await checkoutPage.actions.finish();
  await expect(checkoutPage.elements.successTitle()).toHaveText(MESSAGES.orderPlaced);
  await assertNoHorizontalScroll();

  await cartPage.actions.continueShopping();
  await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
  expect(await cartPage.actions.getCartBadgeCount()).toBe(0);
  await assertNoHorizontalScroll();

  await galleryPage.actions.goToCart();
  await expect(cartPage.elements.emptyTitle()).toHaveText(MESSAGES.cartEmpty);
  await assertNoHorizontalScroll();
};