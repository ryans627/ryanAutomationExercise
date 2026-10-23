import { expect } from "@wdio/globals";
import { ACCOUNTS, HOST, MESSAGES, PASSWORD, PATHS } from "../../constants/constants";
import loginPage from "../../pages/loginPage";

describe("User authentication — regression", () => {
  const WRONG_PASSWORD = "wrong-password";

  beforeEach(async () => {
    await loginPage.navigate();
  });

  it("TC-AUTH-03: User should see an error and stay on the login page when submitting invalid credentials", async () => {
    // Wrong password
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: WRONG_PASSWORD });
    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
    await expect(loginPage.elements.errorMessage()).toBeDisplayed();
    await expect(loginPage.elements.errorMessage()).toHaveText(MESSAGES.invalidCredentials);

    // Empty fields — reload required to reset the React form (setValue("")/clearValue() don't clear it)
    await loginPage.navigate();
    await loginPage.elements.loginButton().click();
    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
    await expect(loginPage.elements.errorMessage()).toBeDisplayed();
    await expect(loginPage.elements.errorMessage()).toHaveText(MESSAGES.usernameRequired);

    // Locked account — non-empty setValue overwrites the fields, no reload needed
    await loginPage.actions.login({ username: ACCOUNTS.locked, password: PASSWORD });
    await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
    await expect(loginPage.elements.errorMessage()).toBeDisplayed();
    await expect(loginPage.elements.errorMessage()).toHaveText(MESSAGES.lockedOut);
  });

  it("TC-AUTH-04: User should be able to log in and log out via each practice-account button", async () => {
    for (const username of Object.values(ACCOUNTS)) {
      await loginPage.actions.usePracticeAccount(username);
      await expect(loginPage.elements.usernameInput()).toHaveValue(username);
      await expect(loginPage.elements.passwordInput()).toHaveValue(PASSWORD);

      // The Locked account cannot log in (covered by TC-AUTH-03); skip its login.
      if (username === ACCOUNTS.locked) {
        continue;
      }

      await loginPage.elements.loginButton().click();
      await expect(browser).toHaveUrl(`${HOST}${PATHS.home}`);
      await expect(loginPage.elements.loggedInUser()).toHaveText(username);
      await loginPage.actions.logout();
      await expect(browser).toHaveUrl(`${HOST}${PATHS.login}`);
    }
  });

  it.skip("TC-AUTH-05: User session should persist across a page reload", async () => {
    // Known failure: BUG-006 — the session is lost across full page loads.
    await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });
    await expect(loginPage.elements.loggedInUser()).toHaveText(ACCOUNTS.shopper);

    await browser.refresh();

    await expect(loginPage.elements.logoutButton()).toBeDisplayed();
  });

  it("TC-AUTH-06: User should be able to toggle password visibility", async () => {
    await loginPage.actions.fillOutFields({ username: ACCOUNTS.shopper, password: PASSWORD });

    await expect(loginPage.elements.passwordInput()).toHaveAttribute("type", "password");
    await loginPage.actions.togglePassword();
    await expect(loginPage.elements.passwordInput()).toHaveAttribute("type", "text");
    await loginPage.actions.togglePassword();
    await expect(loginPage.elements.passwordInput()).toHaveAttribute("type", "password");
  });
});
