import { LoginPage } from './login.page';
import { CatalogPage } from './catalog.page';
import { ProductDetailPage } from './product-detail.page';
import { CartPage } from './cart.page';
import { CheckoutPage } from './checkout.page';

/**
 * Lightweight page registry — mirrors Playwright fixtures pattern.
 * Instantiated once per test file / suite for readable specs.
 */
export class Pages {
  readonly login = new LoginPage();
  readonly catalog = new CatalogPage();
  readonly productDetail = new ProductDetailPage();
  readonly cart = new CartPage();
  readonly checkout = new CheckoutPage();
}

export const pages = new Pages();
