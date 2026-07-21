import { pages } from '../pages';
import { users } from '../data/users';
import { logger } from '../utils/logger';

/**
 * Shared flows used across suites — keeps specs declarative.
 */
export async function resetApp(): Promise<void> {
  logger.info('Resetting app state');
  await browser.execute('mobile: clearApp', {
    appId: 'com.saucelabs.mydemoapp.android',
  });
  await browser.execute('mobile: activateApp', {
    appId: 'com.saucelabs.mydemoapp.android',
  });
  // Splash → catalog
  await pages.catalog.expectLoaded();
}

export async function loginAsStandardUser(): Promise<void> {
  await pages.catalog.openLoginFromMenu();
  await pages.login.expectLoaded();
  await pages.login.loginExpectSuccess(users.standard);
  await pages.catalog.expectLoaded();
}

export async function addProductToCart(productName: string, qty = 1): Promise<void> {
  await pages.catalog.expectLoaded();
  await pages.catalog.openProductByName(productName);
  await pages.productDetail.expectLoaded(productName);
  await pages.productDetail.addProduct(qty);
  await browser.pause(800);
  await browser.back();
  // Ensure we landed back on catalog (not stuck on detail)
  await browser.waitUntil(
    async () => {
      try {
        return (await $(
          'id=com.saucelabs.mydemoapp.android:id/productRV',
        ).isDisplayed()) && !(await $(
          'id=com.saucelabs.mydemoapp.android:id/cartBt',
        ).isDisplayed());
      } catch {
        return false;
      }
    },
    { timeout: 10_000, interval: 300, timeoutMsg: 'Did not return to catalog after add to cart' },
  );
  await pages.catalog.expectLoaded();
  await browser.pause(500);
}
