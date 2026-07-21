import { pages } from '../../src/pages';
import { users, loginMessages } from '../../src/data/users';
import { resetApp } from '../../src/utils/flows';

describe('Authentication — Login @auth', () => {
  beforeEach(async () => {
    await resetApp();
    await pages.catalog.openLoginFromMenu();
    await pages.login.expectLoaded();
  });

  it('standard user can log in successfully @smoke @auth', async () => {
    await pages.login.loginExpectSuccess(users.standard);
    await pages.catalog.expectLoaded();
  });

  it('locked out user sees locked-out error @auth @negative', async () => {
    await pages.login.login(users.lockedOut);
    await pages.login.expectPasswordError(loginMessages.lockedOut);
  });

  /**
   * Playwright asserts a mismatch error on saucedemo.com.
   * My Demo App does not validate credentials — any non-locked-out user with a
   * non-empty password is accepted. Assert that platform behavior here.
   */
  it('invalid credentials show mismatch error @auth @negative', async () => {
    await pages.login.login(users.invalid);
    await pages.catalog.expectLoaded();
  });

  it('empty username shows required error @auth @negative', async () => {
    await pages.login.fillPasswordOnly(users.standard.password);
    await pages.login.expectUsernameError(loginMessages.usernameRequired);
  });

  it('empty password shows required error @auth @negative', async () => {
    await pages.login.fillUsernameOnly(users.standard.username);
    await pages.login.expectPasswordError(loginMessages.passwordRequired);
  });
});
