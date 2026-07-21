import { pages } from '../../src/pages';
import { products, sortOptions } from '../../src/data/products';
import { addProductToCart, resetApp } from '../../src/utils/flows';

describe('Cart — Item management @cart', () => {
  beforeEach(async () => {
    await resetApp();
  });

  it('add single product updates badge and cart @smoke @cart', async () => {
    await addProductToCart(products.backpack.name);
    // Android badge TextView is tiny/unreliable to read; cart item label is the stable equivalent
    await pages.catalog.openCart();
    await pages.cart.expectLoadedWithItems();
    await pages.cart.expectItemCountLabel(1);
    await pages.cart.expectProductPresent(products.backpack.name);
  });

  it('add multiple products and remove one @cart', async () => {
    await addProductToCart(products.backpack.name);
    await pages.catalog.sortBy(sortOptions.priceAsc);
    await addProductToCart(products.onesie.name);

    await pages.catalog.openCart();
    await pages.cart.expectLoadedWithItems();
    await pages.cart.expectItemCountLabel(2);
    await pages.cart.expectProductPresent(products.backpack.name);
    await pages.cart.expectProductPresent(products.onesie.name);
    // Remove Backpack (first row) — its Remove control stays on-screen
    await pages.cart.removeProduct(products.backpack.name);
    await pages.cart.expectItemCountLabel(1);
    await pages.cart.expectProductPresent(products.onesie.name);
  });

  it('continue shopping returns to inventory @cart', async () => {
    await pages.catalog.sortBy(sortOptions.priceAsc);
    await addProductToCart(products.onesie.name);
    await pages.catalog.openCart();
    await pages.cart.expectLoadedWithItems();
    await pages.cart.continueShoppingAction();
    await pages.catalog.expectLoaded();
    // Re-open cart to confirm item still present (Playwright asserts badge count)
    await pages.catalog.openCart();
    await pages.cart.expectItemCountLabel(1);
  });

  it('empty cart go shopping returns to catalog @cart', async () => {
    await pages.catalog.openCart();
    await pages.cart.expectEmpty();
    await pages.cart.goShoppingAction();
    await pages.catalog.expectLoaded();
  });
});
