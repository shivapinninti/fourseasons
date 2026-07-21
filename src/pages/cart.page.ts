import { BasePage } from './base.page';
import { env, rid } from '../config/env';
import { formatCurrency } from '../utils/test-data';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  private readonly title = rid('productTV');
  private readonly itemsList = rid('productRV');
  private readonly itemCount = rid('itemsTV');
  private readonly totalPrice = rid('totalPriceTV');
  private readonly proceedCheckout = rid('cartBt');
  private readonly emptyTitle = rid('noItemTitleTV');
  private readonly goShopping = rid('shoppingBt');
  private readonly removeBtn = rid('removeBt');

  async expectLoadedWithItems(): Promise<void> {
    await this.waitForDisplayed(this.proceedCheckout, 'Proceed To Checkout');
    const title = await this.getText(this.title, 'cart title');
    await expect(title).toBe('My Cart');
  }

  async expectEmpty(): Promise<void> {
    await this.waitForDisplayed(this.emptyTitle, 'empty cart');
    const text = await this.getText(this.emptyTitle, 'empty title');
    await expect(text).toBe('No Items');
  }

  async expectProductPresent(productName: string): Promise<void> {
    await this.scrollCartToProduct(productName);
    await this.waitForDisplayed(this.text(productName), productName);
  }

  async expectItemCountLabel(count: number): Promise<void> {
    const label = await this.getText(this.itemCount, 'items label');
    // App uses plural "Items" even for count === 1
    await expect(label).toBe(`${count} Items`);
  }

  async removeFirstProduct(): Promise<void> {
    logger.info('Removing product from cart');
    await this.tap(this.removeBtn, 'remove');
  }

  /** Remove a cart row by product title (RecyclerView item). */
  async removeProduct(productName: string): Promise<void> {
    logger.info('Removing product from cart', { productName });
    await this.scrollCartToProduct(productName);

    const title = await $(
      `android=new UiSelector().resourceId("${env.appPackage}:id/titleTV").text("${productName}")`,
    );
    await title.waitForExist({
      timeout: this.timeout,
      timeoutMsg: `Cart item "${productName}" not found`,
    });

    // Ensure the Remove control under this title is in view (row is tall)
    await this.revealRemoveUnderTitle(title);

    const titleLoc = await title.getLocation();
    const removeSelector = `android=new UiSelector().resourceId("${env.appPackage}:id/removeBt")`;

    let best: WebdriverIO.Element | undefined;
    for (let attempt = 0; attempt < 4 && !best; attempt++) {
      const removes = await $$(removeSelector);
      const count = Number(await removes.length);
      let bestDelta = Number.POSITIVE_INFINITY;
      for (let i = 0; i < count; i++) {
        try {
          const el = removes[i];
          const loc = await el.getLocation();
          const delta = loc.y - titleLoc.y;
          if (delta >= 0 && delta < bestDelta) {
            bestDelta = delta;
            best = el;
          }
        } catch {
          // stale
        }
      }
      if (!best) {
        await this.swipeCartUp();
        await browser.pause(400);
      }
    }

    if (!best) {
      throw new Error(`Could not find remove control for "${productName}"`);
    }

    await best.click();
    // App intentionally blocks the UI thread for ~5s on remove
    await browser.waitUntil(
      async () => {
        try {
          const titles = await $$(
            `android=new UiSelector().resourceId("${env.appPackage}:id/titleTV").text("${productName}")`,
          );
          return Number(await titles.length) === 0;
        } catch {
          return true;
        }
      },
      {
        timeout: 15_000,
        interval: 500,
        timeoutMsg: `"${productName}" still in cart after remove`,
      },
    );
  }

  private async revealRemoveUnderTitle(
    title: WebdriverIO.Element,
  ): Promise<void> {
    try {
      const loc = await title.getLocation();
      const win = await browser.getWindowRect();
      // If title is in the lower half, nudge the cart up so Remove Item is visible
      if (loc.y > win.height * 0.45) {
        await this.swipeCartUp();
      }
    } catch {
      // ignore
    }
  }

  private async swipeCartUp(): Promise<void> {
    const win = await browser.getWindowRect();
    await browser.execute('mobile: swipeGesture', {
      left: Math.round(win.width * 0.2),
      top: Math.round(win.height * 0.35),
      width: Math.round(win.width * 0.6),
      height: Math.round(win.height * 0.4),
      direction: 'up',
      percent: 0.6,
    });
  }

  private async scrollCartToProduct(productName: string): Promise<void> {
    const selectors = [
      `android=new UiScrollable(new UiSelector().resourceId("${env.appPackage}:id/scrollView")).scrollIntoView(new UiSelector().text("${productName}"))`,
      `android=new UiScrollable(new UiSelector().resourceId("${env.appPackage}:id/productRV")).scrollIntoView(new UiSelector().text("${productName}"))`,
      `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${productName}"))`,
    ];
    for (const selector of selectors) {
      try {
        await $(selector);
        return;
      } catch {
        // try next scroll strategy
      }
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.tap(this.proceedCheckout, 'Proceed To Checkout');
  }

  async goShoppingAction(): Promise<void> {
    await this.tap(this.goShopping, 'Go Shopping');
  }

  /**
   * Cart-with-items has no Continue Shopping CTA (unlike web).
   * Navigate back to catalog — same outcome as Playwright continueShopping.
   */
  async continueShoppingAction(): Promise<void> {
    logger.info('Returning to catalog from cart');
    await browser.back();
  }

  async expectTotalAtLeast(amount: number): Promise<void> {
    const text = await this.getText(this.totalPrice, 'total');
    await expect(text).toContain(formatCurrency(amount).replace('$', ''));
  }
}
