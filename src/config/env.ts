import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function bool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw.toLowerCase() === 'true';
}

export const env = {
  appPath: path.resolve(process.cwd(), required('APP_PATH', './apps/mydemoapp.apk')),
  appPackage: required('APP_PACKAGE', 'com.saucelabs.mydemoapp.android'),
  appActivity: required('APP_ACTIVITY', '.view.activities.SplashActivity'),
  deviceName: required('DEVICE_NAME', 'Android Emulator'),
  platformVersion: required('PLATFORM_VERSION', '12.0'),
  udid: process.env.UDID || undefined,
  appiumHost: required('APPIUM_HOST', '127.0.0.1'),
  appiumPort: Number(process.env.APPIUM_PORT ?? 4723),
  noReset: bool('NO_RESET', false),
  fullReset: bool('FULL_RESET', false),
  explicitWait: Number(process.env.EXPLICIT_WAIT ?? 15_000),
  users: {
    standard: {
      username: required('STANDARD_USER', 'bod@example.com'),
      password: required('STANDARD_PASSWORD', '10203040'),
    },
    lockedOut: {
      username: required('LOCKED_OUT_USER', 'alice@example.com'),
      password: required('STANDARD_PASSWORD', '10203040'),
    },
    visual: {
      username: required('VISUAL_USER', 'visual@example.com'),
      password: required('STANDARD_PASSWORD', '10203040'),
    },
  },
} as const;

export type UserCredentials = {
  username: string;
  password: string;
};

/** Package-prefixed Android resource id helper. */
export function rid(id: string): string {
  return `id=${env.appPackage}:id/${id}`;
}
