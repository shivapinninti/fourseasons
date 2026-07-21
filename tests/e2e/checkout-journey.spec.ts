import { pages } from '../../src/pages';
import { products, sortOptions } from '../../src/data/products';
import {
  generateCheckoutInfo,
  generatePaymentInfo,
} from '../../src/utils/test-data';
import {
  addProductToCart,
  loginAsStandardUser,
  resetApp,
} from '../../src/utils/flows';
import { users } from '../../src/data/users';

describe('E2E — Purchase journey @e2e', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('complete checkout for a single product @smoke @e2e', async () => {
    const shipping = generateCheckoutInfo();
    const payment = generatePaymentInfo(shipping.fullName);

    await loginAsStandardUser();
    await addProductToCart(products.backpack.name);
    await pages.catalog.openCart();
    await pages.cart.expectItemCountLabel(1);
    await pages.cart.expectProductPresent(products.backpack.name);
    await pages.cart.proceedToCheckout();

    await pages.checkout.expectShippingLoaded();
    await pages.checkout.fillShipping(shipping);
    await pages.checkout.continueToPayment();

    await pages.checkout.expectPaymentLoaded();
    await pages.checkout.fillPayment(payment);
    await pages.checkout.reviewOrder();

    await pages.checkout.expectReviewLoaded();
    await pages.checkout.placeOrder();

    await pages.checkout.expectOrderComplete();
    await pages.checkout.continueShoppingAction();
    await pages.catalog.expectLoaded();
  });

  it('complete checkout for multiple products @e2e', async () => {
    const shipping = generateCheckoutInfo();
    const payment = generatePaymentInfo(shipping.fullName);
    // Avoid Bolt T-Shirt — app intentionally adds qty 10 for that SKU
    const selected = [
      products.backpack,
      products.onesie,
      products.fleeceJacket,
    ];

    await loginAsStandardUser();
    await addProductToCart(products.backpack.name);
    await pages.catalog.sortBy(sortOptions.priceAsc);
    await addProductToCart(products.onesie.name);
    await pages.catalog.sortBy(sortOptions.priceDesc);
    await addProductToCart(products.fleeceJacket.name);

    await pages.catalog.openCart();
    await pages.cart.expectItemCountLabel(selected.length);
    for (const product of selected) {
      await pages.cart.expectProductPresent(product.name);
    }
    await pages.cart.proceedToCheckout();

    await pages.checkout.expectShippingLoaded();
    await pages.checkout.fillShipping(shipping);
    await pages.checkout.continueToPayment();
    await pages.checkout.expectPaymentLoaded();
    await pages.checkout.fillPayment(payment);
    await pages.checkout.reviewOrder();
    await pages.checkout.expectReviewLoaded();
    await pages.checkout.placeOrder();
    await pages.checkout.expectOrderComplete();
  });

  it('checkout redirects guest to login then completes @e2e', async () => {
    const shipping = generateCheckoutInfo();
    const payment = generatePaymentInfo(shipping.fullName);

    await pages.catalog.sortBy(sortOptions.priceAsc);
    await addProductToCart(products.onesie.name);
    await pages.catalog.openCart();
    await pages.cart.proceedToCheckout();

    await pages.login.expectLoaded();
    await pages.login.loginExpectSuccess(users.standard);

    await pages.checkout.expectShippingLoaded();
    await pages.checkout.fillShipping(shipping);
    await pages.checkout.continueToPayment();
    await pages.checkout.fillPayment(payment);
    await pages.checkout.reviewOrder();
    await pages.checkout.placeOrder();
    await pages.checkout.expectOrderComplete();
  });

  it('shipping validation requires full name @e2e @negative', async () => {
    await loginAsStandardUser();
    await addProductToCart(products.backpack.name);
    await pages.catalog.openCart();
    await pages.cart.proceedToCheckout();
    await pages.checkout.expectShippingLoaded();
    await pages.checkout.continueToPayment();
    await pages.checkout.expectFullNameRequiredError();
  });
});
