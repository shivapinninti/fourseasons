import { BasePage } from './base.page';
import { rid } from '../config/env';
import { logger } from '../utils/logger';

export class ProductDetailPage extends BasePage {
  private readonly productName = rid('productTV');
  private readonly price = rid('priceTV');
  private readonly plus = rid('plusIV');
  private readonly minus = rid('minusIV');
  private readonly quantity = rid('noTV');
  private readonly addToCart = rid('cartBt');

  async expectLoaded(expectedName?: string): Promise<void> {
    await this.waitForDisplayed(this.addToCart, 'Add to cart');
    if (expectedName) {
      const name = await this.getText(this.productName, 'product name');
      await expect(name).toBe(expectedName);
    }
  }

  async setQuantity(qty: number): Promise<void> {
    logger.info('Setting quantity', { qty });
    const current = Number(await this.getText(this.quantity, 'quantity'));
    if (qty > current) {
      for (let i = current; i < qty; i++) {
        await this.tap(this.plus, 'increase quantity');
      }
    } else if (qty < current) {
      for (let i = current; i > qty; i--) {
        await this.tap(this.minus, 'decrease quantity');
      }
    }
  }

  async addToCartAction(): Promise<void> {
    await this.tap(this.addToCart, 'add to cart');
  }

  async addProduct(qty = 1): Promise<void> {
    if (qty > 1) {
      await this.setQuantity(qty);
    }
    await this.addToCartAction();
  }
}
