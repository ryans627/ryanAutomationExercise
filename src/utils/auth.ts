import { PASSWORD } from "../constants/constants";
import loginPage from "../pages/loginPage";

/** Log in as the given account and wait for the session to be ready. */
export async function loginAs(username: string): Promise<void> {
  await loginPage.navigate();
  await loginPage.actions.login({ username, password: PASSWORD });
  await loginPage.elements.logoutButton().waitForDisplayed();
}
