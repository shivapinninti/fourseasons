import { pages } from '../../src/pages';
import { loginAsStandardUser, resetApp } from '../../src/utils/flows';

describe('Authentication — Logout @auth', () => {
  beforeEach(async () => {
    await resetApp();
    await loginAsStandardUser();
  });

  it('user can log out and return to login @smoke @auth', async () => {
    await pages.catalog.logout();
    await pages.login.expectLoaded();
  });
});
