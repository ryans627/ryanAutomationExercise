import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest } from "../utils/helpers";
import { Page } from "./Page";

/** Checkout page (`/checkout`). */
class CheckoutPage extends Page {
  protected readonly path = PATHS.checkout;

  readonly elements = {
    firstNameInput: () => getByDataTest(DATATEST.checkoutFirstName),
    lastNameInput: () => getByDataTest(DATATEST.checkoutLastName),
    postalCodeInput: () => getByDataTest(DATATEST.checkoutPostalCode),
    continueButton: () => getByDataTest(DATATEST.continueToSummary),
    finishButton: () => getByDataTest(DATATEST.finishButton),
  };

  readonly actions = {
    fillShippingInfo: async ({
      firstName,
      lastName,
      postalCode,
    }: {
      firstName: string;
      lastName: string;
      postalCode: string;
    }) => {
      await this.elements.firstNameInput().setValue(firstName);
      await this.elements.lastNameInput().setValue(lastName);
      await this.elements.postalCodeInput().setValue(postalCode);
    },
    continueToSummary: async () => {
      await this.elements.continueButton().click();
    },
    finish: async () => {
      await this.elements.finishButton().click();
    },
  };
}

export default new CheckoutPage();
