import { UserCredentials, env } from '../config/env';

export const users = {
  standard: env.users.standard,
  lockedOut: env.users.lockedOut,
  visual: env.users.visual,
  /** Unknown user — My Demo App does not reject mismatch credentials (unlike saucedemo.com). */
  invalid: {
    username: 'nobody@example.com',
    password: 'wrong_password',
  } satisfies UserCredentials,
} as const;

export const loginMessages = {
  usernameRequired: 'Username is required',
  passwordRequired: 'Enter Password',
  lockedOut: 'Sorry this user has been locked out.',
} as const;
