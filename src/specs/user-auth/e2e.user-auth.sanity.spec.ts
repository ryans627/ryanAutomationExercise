import { expect } from "@wdio/globals";
import { ACCOUNTS, HOST, PASSWORD, PATHS } from "../../constants/constants";
import galleryPage from "../../pages/galleryPage";
import header from "../../pages/header";
import loginPage from "../../pages/loginPage";

describe("User authentication — sanity", () => {
  beforeEach(async () => {
    await loginPage.navigate();
  });

  it("TC-AUTH-01: User with valid credentials should be able to log in successfully", async () => {
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });

    await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
    await expect(header.elements.loggedInUser()).toHaveText(ACCOUNTS.shopper);
    await expect(header.elements.logoutButton()).toBeDisplayed();
    await expect(galleryPage.elements.searchBox()).toBeDisplayed();
  });

  it("TC-AUTH-02: User should be logged out and redirected to the login page when clicking logout", async () => {
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });
    await expect(header.elements.loggedInUser()).toHaveText(ACCOUNTS.shopper);
    await expect(header.elements.logoutButton()).toBeDisplayed();
    await header.actions.logout();

    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
  });
});
