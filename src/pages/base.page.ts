import { ChainablePromiseElement } from 'webdriverio';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Shared mobile page behaviors: waits, taps, typing, visibility.
 */
export abstract class BasePage {
  protected get timeout(): number {
    return env.explicitWait;
  }

  protected async $(selector: string): Promise<WebdriverIO.Element> {
    return $(selector);
  }

  protected async waitForDisplayed(
    selector: string,
    description: string,
    timeout = this.timeout,
  ): Promise<WebdriverIO.Element> {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout, timeoutMsg: `${description} not displayed` });
    return el;
  }

  protected async tap(selector: string, description: string): Promise<void> {
    logger.debug(`Tap: ${description}`);
    const el = await this.waitForDisplayed(selector, description);
    await el.click();
  }

  protected async type(
    selector: string,
    value: string,
    description: string,
    clear = true,
  ): Promise<void> {
    logger.debug(`Type: ${description}`);
    const el = await this.waitForDisplayed(selector, description);
    if (clear) {
      await el.clearValue();
    }
    await el.setValue(value);
  }

  protected async getText(selector: string, description: string): Promise<string> {
    const el = await this.waitForDisplayed(selector, description);
    return el.getText();
  }

  protected async isDisplayed(selector: string): Promise<boolean> {
    const el = await $(selector);
    return el.isDisplayed().catch(() => false);
  }

  protected async waitUntilGone(selector: string, description: string): Promise<void> {
    await browser.waitUntil(
      async () => {
        try {
          const el = await $(selector);
          return !(await el.isDisplayed());
        } catch {
          return true;
        }
      },
      {
        timeout: this.timeout,
        timeoutMsg: `${description} still visible`,
        interval: 300,
      },
    );
  }

  /** Convenience for accessibility id (content-desc). */
  protected a11y(desc: string): string {
    return `~${desc}`;
  }

  /** Convenience for Android UiSelector text. */
  protected text(value: string): string {
    return `android=new UiSelector().text("${value}")`;
  }

  protected textContains(value: string): string {
    return `android=new UiSelector().textContains("${value}")`;
  }
}

export type { ChainablePromiseElement };
