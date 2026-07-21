import { BasePage } from './base.page';
import { rid } from '../config/env';
import { UserCredentials } from '../config/env';
import { logger } from '../utils/logger';

export class LoginPage extends BasePage {
  private readonly username = rid('nameET');
  private readonly password = rid('passwordET');
  private readonly loginBtn = rid('loginBtn');
  private readonly usernameError = rid('nameErrorTV');
  private readonly passwordError = rid('passwordErrorTV');
  private readonly title = rid('loginTV');

  async expectLoaded(): Promise<void> {
    await this.waitForDisplayed(this.title, 'Login title');
    await this.waitForDisplayed(this.loginBtn, 'Login button');
  }

  async login(credentials: UserCredentials): Promise<void> {
    logger.info('Logging in', { username: credentials.username });
    await this.type(this.username, credentials.username, 'username');
    if (credentials.password) {
      await this.type(this.password, credentials.password, 'password');
    }
    await this.tap(this.loginBtn, 'login button');
  }

  async loginExpectSuccess(credentials: UserCredentials): Promise<void> {
    await this.login(credentials);
    await this.waitUntilGone(this.loginBtn, 'Login button');
  }

  async expectUsernameError(message: string): Promise<void> {
    const text = await this.getText(this.usernameError, 'username error');
    await expect(text).toBe(message);
  }

  async expectPasswordError(message: string): Promise<void> {
    const text = await this.getText(this.passwordError, 'password error');
    await expect(text).toBe(message);
  }

  async submitEmpty(): Promise<void> {
    await this.tap(this.loginBtn, 'login button');
  }

  async fillUsernameOnly(username: string): Promise<void> {
    await this.type(this.username, username, 'username');
    await this.tap(this.loginBtn, 'login button');
  }

  async fillPasswordOnly(password: string): Promise<void> {
    await this.type(this.password, password, 'password');
    await this.tap(this.loginBtn, 'login button');
  }
}
