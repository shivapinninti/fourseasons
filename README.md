# shiva_assessment_demo_appium

Enterprise-style **Appium 2 + WebdriverIO + TypeScript** mobile E2E framework for  
[Sauce Labs My Demo App (Android)](https://github.com/saucelabs/my-demo-app-android).

---

## Highlights

| Practice | Implementation |
|---|---|
| Page Object Model | `src/pages/*` with shared `BasePage` waits/taps |
| Flow helpers | `src/utils/flows.ts` (login, add-to-cart, reset) |
| Stable locators | Package resource-ids + accessibility (`content-desc`) |
| Test data | Env credentials + generated shipping/payment data |
| Tagging | `@smoke`, `@auth`, `@cart`, `@catalog`, `@e2e`, `@negative` |
| Reporting | Spec + JUnit XML + Allure (+ screenshots on failure) |
| CI | GitHub Actions with Android emulator |
| Isolation | App clear/activate between tests |

---

## Project structure

```
shiva_assessment_demo_appium/
├── .github/workflows/ci.yml
├── apps/mydemoapp.apk          # local debug APK (gitignored)
├── src/
│   ├── config/env.ts
│   ├── data/                   # users, products
│   ├── pages/                  # Page Objects
│   └── utils/                  # flows, logger, test-data
├── tests/
│   ├── auth/
│   ├── catalog/
│   ├── cart/
│   └── e2e/
├── wdio.conf.ts
└── README.md
```

---

## Prerequisites

- Node.js **18–25** (**20 LTS recommended** — Node 26 breaks WebdriverIO session create: `UND_ERR_INVALID_ARG`)
- JDK 11+ (17 recommended for SDK tools)
- Android SDK + emulator **or** a USB device with debugging enabled
- Built debug APK from `my-demo-app-android`

### One-time Android setup

```bash
# Emulator AVD used in this environment
emulator -avd Demo_API31 -gpu auto &

# Copy APK into the project
npm run prepare:apk
# or:
# cp ../my-demo-app-android/app/build/outputs/apk/debug/app-debug.apk apps/mydemoapp.apk
```

---

## Quick start

```bash
cd /Users/naresh.eeda/Documents/demo/shiva_assessment_demo_appium

npm install
npx appium driver install uiautomator2@3.9.6   # Appium 2–compatible driver
cp .env.example .env
npm run prepare:apk

# Ensure emulator/device is online
adb devices

# Run full suite
npm test
```

---

## Scripts

| Command | Purpose |
|---|---|
| `npm test` | Full Appium suite |
| `npm run test:smoke` | `@smoke` tests only |
| `npm run test:auth` | Auth specs |
| `npm run test:catalog` | Catalog sort specs |
| `npm run test:cart` | Cart specs |
| `npm run test:e2e` | Checkout journeys |
| `npm run report:allure` | Generate & open Allure report |
| `npm run lint:types` | TypeScript check |
| `npm run prepare:apk` | Copy debug APK from sibling Android project |
| `npm run clean` | Remove reports |

---

## Test coverage

Mirrors the Playwright suite in `../shiva_assessment_demo` (same titles / tags), adapted to My Demo App UI.

### Authentication
- Successful login (`bod@example.com` / `10203040`)
- Locked-out user (`alice@example.com`)
- Invalid credentials (demo app accepts unknown users — no mismatch error like saucedemo.com)
- Empty username / password validation
- Logout confirmation

### Catalog
- Sort name A→Z / Z→A
- Sort price low→high / high→low

### Cart
- Add product → badge + cart contents
- Add multiple products and remove one
- Continue shopping returns to catalog (system Back — Android has no Continue CTA on filled cart)
- Go Shopping from empty cart (Android-only empty state)

### E2E checkout
- Logged-in purchase (shipping → payment → review → complete)
- Multi-product checkout
- Guest checkout → login gate → complete order (Android-only; web requires login first)
- Shipping validation (full name required)

> **Note:** The catalog is a 2-column grid with many color-variant SKUs. Product-open helpers match **exact** titles and prefer first-screen / price-sorted items for stability.

---

## Reporting

| Artifact | Location |
|---|---|
| Spec (console) | terminal |
| JUnit XML | `reports/junit/results.xml` |
| Allure raw | `allure-results/` |
| Screenshots | captured on failure into Allure |

```bash
npm test
npm run report:allure
```

---

## Git workflow

```
main
 └─ feature/*
 └─ fix/*
```

1. Branch from `main`
2. Commit with `test:` / `fix:` / `ci:` / `docs:` prefixes
3. PR → CI boots an emulator and runs Appium
4. Merge when green

---

## Capabilities (defaults)

| Capability | Value |
|---|---|
| `platformName` | Android |
| `automationName` | UiAutomator2 |
| `appPackage` | `com.saucelabs.mydemoapp.android` |
| `appActivity` | `.view.activities.SplashActivity` |
| `autoGrantPermissions` | `true` |

Override via `.env` (`DEVICE_NAME`, `PLATFORM_VERSION`, `UDID`, `APP_PATH`, …).

---

## Credentials (My Demo App)

| User | Password | Notes |
|---|---|---|
| `bod@example.com` | `10203040` | Standard success |
| `alice@example.com` | any | Locked out |
| `visual@example.com` | `10203040` | Visual user |

---

## Relationship to Playwright project

| | `shiva_assessment_demo` | `shiva_assessment_demo_appium` |
|---|---|---|
| Stack | Playwright | Appium + WDIO |
| AUT | saucedemo.com (web) | My Demo App (Android) |
| Domains | auth, catalog, cart, checkout | same |

---

## License

MIT
