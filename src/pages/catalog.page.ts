import { BasePage } from './base.page';
import { env, rid } from '../config/env';
import { SortOption, sortOptions } from '../data/products';
import { parseCurrency } from '../utils/test-data';
import { logger } from '../utils/logger';

export class CatalogPage extends BasePage {
  private readonly title = rid('productTV');
  private readonly productList = rid('productRV');
  private readonly sortButton = rid('sortIV');
  private readonly menuButton = rid('menuIV');
  private readonly cartButton = rid('cartRL');

  async expectLoaded(): Promise<void> {
    await this.waitForDisplayed(this.productList, 'product catalog');
    await browser.waitUntil(
      async () => (await this.getText(this.title, 'catalog title')) === 'Products',
      {
        timeout: this.timeout,
        timeoutMsg: 'Catalog title "Products" not shown',
        interval: 300,
      },
    );
  }

  async openSort(): Promise<void> {
    await this.tap(this.sortButton, 'sort');
    await this.waitForDisplayed(rid('sortTV'), 'sort dialog');
  }

  async sortBy(option: SortOption): Promise<void> {
    logger.info('Sorting catalog', { option });
    await this.openSort();
    await this.tap(this.a11y(option), option);
  }

  async getVisibleProductNames(): Promise<string[]> {
    const titles = await $$(`${rid('titleTV')}`);
    const names: string[] = [];
    for (const t of titles) {
      if (await t.isDisplayed()) {
        names.push(await t.getText());
      }
    }
    return names;
  }

  async getVisibleProductPrices(): Promise<number[]> {
    const prices = await $$(`${rid('priceTV')}`);
    const values: number[] = [];
    for (const p of prices) {
      if (await p.isDisplayed()) {
        values.push(parseCurrency(await p.getText()));
      }
    }
    return values;
  }

  private async ensureOnCatalog(): Promise<void> {
    for (let i = 0; i < 4; i++) {
      if (await $(this.productList).isDisplayed().catch(() => false)) {
        return;
      }
      await browser.back();
      await browser.pause(500);
    }
    await this.expectLoaded();
  }

  private async scrollCatalogDown(): Promise<void> {
    await this.ensureOnCatalog();
    const list = await $(this.productList);
    const loc = await list.getLocation();
    const size = await list.getSize();
    await browser.execute('mobile: swipeGesture', {
      left: loc.x + Math.round(size.width * 0.2),
      top: loc.y + Math.round(size.height * 0.25),
      width: Math.round(size.width * 0.6),
      height: Math.round(size.height * 0.5),
      direction: 'up',
      percent: 0.75,
    });
    await browser.pause(400);
  }

  /**
   * Only productIV is clickable. Resolve the image via fromParent of the title row,
   * then confirm product-detail loaded for that exact name.
   */
  async openProductByName(productName: string): Promise<void> {
    logger.info('Opening product', { productName });

    const imageSelector =
      `android=new UiSelector().resourceId("${env.appPackage}:id/titleTV").text("${productName}")` +
      `.fromParent(new UiSelector().resourceId("${env.appPackage}:id/productIV"))`;

    const onDetailFor = async (name: string): Promise<boolean> => {
      try {
        const cart = await $(rid('cartBt'));
        if (!(await cart.isDisplayed())) return false;
        const shown = await $(rid('productTV')).getText();
        return shown === name;
      } catch {
        return false;
      }
    };

    const tryOpen = async (): Promise<boolean> => {
      for (let attempt = 0; attempt < 10; attempt++) {
        if (await onDetailFor(productName)) return true;
        await this.ensureOnCatalog();

        const image = await $(imageSelector);
        if (await image.isDisplayed().catch(() => false)) {
          await image.click();
          const opened = await browser
            .waitUntil(async () => onDetailFor(productName), {
              timeout: 8_000,
              interval: 300,
            })
            .then(() => true)
            .catch(() => false);
          if (opened) return true;
          await this.ensureOnCatalog();
        }
        await this.scrollCatalogDown();
      }
      return false;
    };

    await this.ensureOnCatalog();
    let opened = await tryOpen();
    if (!opened) {
      logger.info('Product not found after swipe — sorting price ascending');
      await this.sortBy(sortOptions.priceAsc);
      opened = await tryOpen();
    }
    if (!opened) {
      logger.info('Still not found — sorting price descending');
      await this.sortBy(sortOptions.priceDesc);
      opened = await tryOpen();
    }

    if (!opened) {
      throw new Error(`Could not find/open product "${productName}" in catalog`);
    }
  }

  async openCart(): Promise<void> {
    await this.tap(this.cartButton, 'cart');
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      await browser.waitUntil(
        async () => {
          try {
            const text = (
              (await $(rid('cartTV')).getAttribute('text')) ?? ''
            ).trim();
            return text === '' || text === '0';
          } catch {
            return true;
          }
        },
        {
          timeout: this.timeout,
          timeoutMsg: 'cart badge still visible when expecting 0',
          interval: 400,
        },
      );
      return;
    }

    // Tiny badge TextView often fails isDisplayed()/getText(); read text attribute instead
    await browser.waitUntil(
      async () => {
        try {
          const el = await $(
            `android=new UiSelector().resourceId("${env.appPackage}:id/cartTV")`,
          );
          const text = ((await el.getAttribute('text')) ?? '').trim();
          return text === String(count);
        } catch {
          return false;
        }
      },
      {
        timeout: this.timeout,
        timeoutMsg: `cart count not displayed as ${count}`,
        interval: 400,
      },
    );
  }

  async openMenu(): Promise<void> {
    await this.tap(this.menuButton, 'menu');
    await this.waitForDisplayed(rid('menuRV'), 'menu list');
  }

  async openLoginFromMenu(): Promise<void> {
    await this.openMenu();
    await this.tap(this.a11y('Login Menu Item'), 'Login menu item');
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.openMenu();
    await this.tap(this.a11y('Logout Menu Item'), 'Logout menu item');
    await this.tap(this.text('LOGOUT'), 'confirm logout');
  }
}
