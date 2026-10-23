import { expect } from "@wdio/globals";
import { ACCOUNTS, HOST, PASSWORD, PATHS } from "../../constants/constants";
import galleryPage from "../../pages/galleryPage";
import loginPage from "../../pages/loginPage";

describe("User authentication — sanity", () => {
  beforeEach(async () => {
    await loginPage.navigate();
  });

  it("TC-AUTH-01: User with valid credentials should be able to log in successfully", async () => {
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });

    await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
    await expect(loginPage.elements.loggedInUser()).toHaveText(ACCOUNTS.shopper);
    await expect(loginPage.elements.logoutButton()).toBeDisplayed();
    await expect(galleryPage.elements.searchBox()).toBeDisplayed();
  });

  it("TC-AUTH-02: User should be logged out and redirected to the login page when clicking logout", async () => {
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });
    await expect(loginPage.elements.loggedInUser()).toHaveText(ACCOUNTS.shopper);
    await expect(loginPage.elements.logoutButton()).toBeDisplayed();
    await loginPage.actions.logout();

    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
  });
});
