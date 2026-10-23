import { ACCOUNTS, PASSWORD } from "../constants/constants";
import loginPage from "../pages/loginPage";

/** Log in as the Shopper account and wait for the session to be ready. */
export async function loginAsShopper(): Promise<void> {
  await loginPage.navigate();
  await loginPage.actions.login({ username: ACCOUNTS.shopper, password: PASSWORD });
  await loginPage.elements.logoutButton().waitForDisplayed();
}
