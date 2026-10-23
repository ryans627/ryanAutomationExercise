import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest } from "../utils/helpers";
import { Page } from "./Page";

class LoginPage extends Page {
  protected readonly path = PATHS.login;

  readonly elements = {
    usernameInput: () => getByDataTest(DATATEST.username),
    passwordInput: () => getByDataTest(DATATEST.password),
    togglePasswordVisibility: () => getByDataTest(DATATEST.togglePasswordVisibility),
    loginButton: () => getByDataTest(DATATEST.loginButton),
    errorMessage: () => getByDataTest(DATATEST.loginErrorMessage),
    practiceAccountButton: (username: string) => getByDataTest(`hint-user-${username}`),
  };

  readonly actions = {
    fillOutFields: async ({ username, password }: { username: string; password: string }) => {
      await this.elements.usernameInput().clearValue();
      await this.elements.passwordInput().clearValue();
      await this.elements.usernameInput().setValue(username);
      await this.elements.passwordInput().setValue(password);
    },
    login: async ({ username, password }: { username: string; password: string }) => {
      await this.actions.fillOutFields({ username, password });
      await this.elements.loginButton().click();
    },
    usePracticeAccount: async (username: string) => {
      await this.elements.practiceAccountButton(username).click();
    },
    togglePassword: async () => {
      await this.elements.togglePasswordVisibility().click();
    },
  };
}

export default new LoginPage();
