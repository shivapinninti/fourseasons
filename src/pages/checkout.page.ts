import { BasePage } from './base.page';
import { rid } from '../config/env';
import { CheckoutInfo, PaymentInfo } from '../utils/test-data';
import { logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  // Shipping
  private readonly shippingSubtitle = rid('enterShippingAddressTV');
  private readonly fullName = rid('fullNameET');
  private readonly address1 = rid('address1ET');
  private readonly address2 = rid('address2ET');
  private readonly city = rid('cityET');
  private readonly state = rid('stateET');
  private readonly zip = rid('zipET');
  private readonly country = rid('countryET');
  private readonly toPayment = rid('paymentBtn');

  // Payment
  private readonly paymentTitle = rid('enterPaymentTitleTV');
  private readonly cardName = rid('nameET');
  private readonly cardNumber = rid('cardNumberET');
  private readonly expiration = rid('expirationDateET');
  private readonly securityCode = rid('securityCodeET');

  // Complete
  private readonly completeTitle = rid('completeTV');
  private readonly thankYou = rid('thankYouTV');
  private readonly continueShopping = rid('shoopingBt');

  async expectShippingLoaded(): Promise<void> {
    await this.waitForDisplayed(this.shippingSubtitle, 'shipping subtitle');
    const text = await this.getText(this.shippingSubtitle, 'shipping subtitle');
    await expect(text).toBe('Enter a shipping address');
  }

  async fillShipping(info: CheckoutInfo): Promise<void> {
    logger.info('Filling shipping', { fullName: info.fullName });
    await this.type(this.fullName, info.fullName, 'full name');
    await this.type(this.address1, info.address1, 'address1');
    await this.type(this.address2, info.address2, 'address2');
    await this.type(this.city, info.city, 'city');
    await this.type(this.state, info.state, 'state');
    await this.type(this.zip, info.zip, 'zip');
    await this.type(this.country, info.country, 'country');
  }

  async continueToPayment(): Promise<void> {
    try {
      await browser.hideKeyboard();
    } catch {
      // already hidden
    }
    const byText = this.text('To Payment');
    if (await $(byText).isExisting()) {
      await this.tap(byText, 'To Payment');
    } else {
      await this.tap(this.toPayment, 'To Payment');
    }
  }

  async expectPaymentLoaded(): Promise<void> {
    await this.waitForDisplayed(this.paymentTitle, 'payment title');
    await this.waitForDisplayed(this.cardNumber, 'card number');
  }

  async fillPayment(info: PaymentInfo): Promise<void> {
    logger.info('Filling payment', { cardHolder: info.cardHolder });
    await this.type(this.cardName, info.cardHolder, 'card holder');
    await this.type(this.cardNumber, info.cardNumber, 'card number');
    await this.type(this.expiration, info.expiration, 'expiration');
    await this.type(this.securityCode, info.securityCode, 'security code');
  }

  async reviewOrder(): Promise<void> {
    // Hide keyboard so the CTA is tappable
    try {
      await browser.hideKeyboard();
    } catch {
      // keyboard may already be hidden
    }
    const byText = this.text('Review Order');
    if (await $(byText).isExisting()) {
      await this.tap(byText, 'Review Order');
    } else {
      await this.tap(this.toPayment, 'Review Order');
    }
  }

  async expectReviewLoaded(): Promise<void> {
    await this.waitForDisplayed(this.shippingSubtitle, 'review subtitle');
    const text = await this.getText(this.shippingSubtitle, 'review subtitle');
    await expect(text).toBe('Review your order');
  }

  async placeOrder(): Promise<void> {
    const byText = this.text('Place Order');
    if (await $(byText).isExisting()) {
      await this.tap(byText, 'Place Order');
    } else {
      await this.tap(this.toPayment, 'Place Order');
    }
  }

  async expectOrderComplete(): Promise<void> {
    await this.waitForDisplayed(this.completeTitle, 'checkout complete');
    const title = await this.getText(this.completeTitle, 'complete title');
    await expect(title).toBe('Checkout Complete');
    const thanks = await this.getText(this.thankYou, 'thank you');
    await expect(thanks).toBe('Thank you for your order');
  }

  async continueShoppingAction(): Promise<void> {
    await this.tap(this.continueShopping, 'Continue Shopping');
  }

  async expectFullNameRequiredError(): Promise<void> {
    const error = await this.getText(
      this.textContains('Please provide your full name'),
      'full name error',
    );
    await expect(error).toContain('Please provide your full name');
  }
}
