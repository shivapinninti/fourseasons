import path from 'path';
import dotenv from 'dotenv';
import type { Options } from '@wdio/types';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const APP_PATH = path.resolve(
  process.cwd(),
  process.env.APP_PATH ?? './apps/mydemoapp.apk',
);
const EXPLICIT_WAIT = Number(process.env.EXPLICIT_WAIT ?? 15_000);

export const config: Options.Testrunner = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  specs: ['./tests/**/*.spec.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.DEVICE_NAME ?? 'Android Emulator',
      'appium:platformVersion': process.env.PLATFORM_VERSION ?? '12.0',
      'appium:app': APP_PATH,
      'appium:appPackage':
        process.env.APP_PACKAGE ?? 'com.saucelabs.mydemoapp.android',
      'appium:appActivity':
        process.env.APP_ACTIVITY ?? '.view.activities.SplashActivity',
      'appium:noReset': (process.env.NO_RESET ?? 'false').toLowerCase() === 'true',
      'appium:fullReset':
        (process.env.FULL_RESET ?? 'false').toLowerCase() === 'true',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      'appium:disableWindowAnimation': true,
      'appium:adbExecTimeout': 120_000,
      ...(process.env.UDID ? { 'appium:udid': process.env.UDID } : {}),
    },
  ],

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: EXPLICIT_WAIT,
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 2,

  services: [
    [
      'appium',
      {
        args: {
          address: '127.0.0.1',
          port: Number(process.env.APPIUM_PORT ?? 4723),
          relaxedSecurity: true,
        },
      },
    ],
  ],

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'junit',
      {
        outputDir: './reports/junit',
        outputFileFormat: () => 'results.xml',
      },
    ],
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 180_000,
    retries: process.env.CI ? 1 : 0,
  },

  before: async () => {
    await browser.setTimeout({ implicit: 0 });
  },

  afterTest: async function (_test, _context, { error }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },
};
