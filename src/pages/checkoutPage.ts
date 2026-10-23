import { DATATEST, PATHS } from "../constants/constants";
import { getByDataTest, parseCurrency, parsePercentage } from "../utils/helpers";
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
    firstNameError: () => getByDataTest(DATATEST.firstNameError),
    lastNameError: () => getByDataTest(DATATEST.lastNameError),
    postalCodeError: () => getByDataTest(DATATEST.postalCodeError),
    subtotal: () => getByDataTest(DATATEST.checkoutSubtotal),
    tax: () => getByDataTest(DATATEST.checkoutTax),
    total: () => getByDataTest(DATATEST.checkoutTotal),
    itemName: () => getByDataTest(DATATEST.checkoutItemName),
    itemQty: () => getByDataTest(DATATEST.checkoutItemQty),
    itemSubtotal: () => getByDataTest(DATATEST.checkoutItemSubtotal),
    shippingInfo: () => getByDataTest(DATATEST.shippingInfo),
    successTitle: () => getByDataTest(DATATEST.checkoutSuccessTitle),
    successMessage: () => getByDataTest(DATATEST.checkoutSuccessMessage),
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
      await this.elements.firstNameInput().clearValue();
      await this.elements.lastNameInput().clearValue();
      await this.elements.postalCodeInput().clearValue();
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
    getSubtotal: async () => parseCurrency(await this.elements.subtotal().getText()),
    getTax: async () => parseCurrency(await this.elements.tax().getText()),
    getTotal: async () => parseCurrency(await this.elements.total().getText()),
    getTaxRate: async () => parsePercentage(await this.elements.tax().previousElement().getText()),
  };
}

export default new CheckoutPage();
