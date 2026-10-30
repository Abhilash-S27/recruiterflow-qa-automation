# SauceDemo UI + ReqRes API Test Automation (Playwright + TypeScript)

This is a **test automation project**, not a website. It uses Playwright and TypeScript to automate:

- **UI scenarios** on the existing SauceDemo shop: https://www.saucedemo.com
- **API scenarios** on the existing ReqRes REST API: https://reqres.in

It was built for the RecruiterFlow QA Automation Intern take-home assignment. There are 8 tests in total: the 5 required scenarios plus 3 bonus tests. The 4th bonus item is a Page Object that the UI tests reuse.

## Technology stack

- Node.js and npm
- TypeScript
- Playwright Test (`@playwright/test`) with the HTML reporter
- Chromium only
- Playwright's built-in `request` fixture for API tests (no extra API library)
- Git

## Project structure

```
.
├── pages/
│   └── LoginPage.ts
├── tests/
│   ├── api/
│   │   └── users.spec.ts
│   └── ui/
│       ├── cart.spec.ts
│       └── login.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

`node_modules/`, `playwright-report/` and `test-results/` are created when you install and run the tests. They are listed in `.gitignore` and are not part of the repository.

## Prerequisites

- Node.js 18 or newer (developed and run on Node.js v24.15.0)
- npm (installed with Node.js)
- Git
- A free ReqRes account and API key (needed for the API tests only, see below)

## Installation and setup (Windows PowerShell)

Replace the placeholders with your own values.

```powershell
git clone <REPO_URL>
cd <REPO_FOLDER>
npm install
npx playwright install chromium
```

- `npm install` downloads the libraries listed in `package.json`.
- `npx playwright install chromium` downloads the Chromium browser that Playwright controls.

## ReqRes API key

ReqRes requires an API key. Every API request in this project sends it in the `x-api-key` header, and the tests read the key from the `REQRES_API_KEY` environment variable. The key is never stored in the code or in this repository.

1. Create a free account at https://app.reqres.in and copy your API key from https://app.reqres.in/api-keys. Please use your own key, because the author's key may expire or be rate-limited.
2. In the PowerShell window you will run the tests from, run:

   ```powershell
   $env:REQRES_API_KEY = Read-Host "Paste your ReqRes API key"
   ```

3. When the prompt `Paste your ReqRes API key:` appears, paste the key and press Enter. Do not put the key inside the command itself. This way it is not saved in your command history.
4. Check that it is set (this does not print the key):

   ```powershell
   if ($env:REQRES_API_KEY) { "Key is set" } else { "Key is NOT set" }
   ```

Notes:

- The variable only lasts for that terminal session. In a new terminal window, repeat steps 2 and 3.
- All three API tests need the key: GET user 2, POST create user, and the GET user 23 bonus test. Without it they fail with an authorization error (typically 401).
- The UI tests do not need the key.
- On macOS or Linux, set the `REQRES_API_KEY` environment variable with your shell's usual method.

## Running the tests

No npm scripts are defined. Use `npx playwright` directly. Set the API key first if you run the API tests.

| Goal | Command |
|---|---|
| Run all tests | `npx playwright test` |
| Run only UI tests | `npx playwright test tests/ui` |
| Run only API tests | `npx playwright test tests/api` |
| Run one file | `npx playwright test tests/ui/login.spec.ts` |
| List tests without running them | `npx playwright test --list` |
| Open the HTML report | `npx playwright show-report` |

Every run writes an HTML report to `playwright-report/`. `npx playwright show-report` opens it in your browser at http://localhost:9323. Press Ctrl+C in the terminal to stop it.

## Test scenarios

### Required scenarios (5)

| # | Type | Scenario | Test name | File |
|---|---|---|---|---|
| 1 | UI | Valid login as `standard_user` shows the Products title | `standard user can log in and see the Products page` | `tests/ui/login.spec.ts` |
| 2 | UI | `locked_out_user` sees an error containing "locked out" | `locked out user sees an error` | `tests/ui/login.spec.ts` |
| 3 | UI | Adding a product shows 1 on the cart badge | `adding a product to the cart shows 1 on the cart badge` | `tests/ui/cart.spec.ts` |
| 4 | API | `GET /api/users/2` returns 200 and has `data.email` | `GET user 2 returns 200 and an email` | `tests/api/users.spec.ts` |
| 5 | API | `POST /api/users` (morpheus, leader) returns 201 and the name | `POST creates a user named morpheus` | `tests/api/users.spec.ts` |

### Bonus scenarios (4)

| Bonus | Scenario | Test name or file |
|---|---|---|
| Remove from cart | Removing the product makes the cart badge disappear | `removing a product from the cart makes the cart badge disappear` (`tests/ui/cart.spec.ts`) |
| Logout | Logging out from the side menu returns to the login page | `logged in user can log out and returns to the login page` (`tests/ui/login.spec.ts`) |
| 404 API test | `GET /api/users/23` returns 404 | `GET user 23 returns 404` (`tests/api/users.spec.ts`) |
| Page Object | Login steps live in one reusable class | `pages/LoginPage.ts` |

## Page Object Model

`pages/LoginPage.ts` is a small class that describes the SauceDemo login page. Instead of repeating the same login steps in every test, the class holds them in one place:

- It stores the browser page it is given and defines locators for the username field, password field, Login button and error message.
- `goto()` opens the login page.
- `login(username, password)` fills both fields and clicks Login.

All five UI tests create a `LoginPage` and call `goto()` and `login(...)`. This replaces the same four lines that were repeated in every test, so a change to the login page only needs to be fixed in one file. The assertions stay inside each test, so each test still shows what it verifies.

## Notes

- The tests use public websites, so a slow network can occasionally cause a timeout. Re-running the test is usually enough.
- Locators prefer `getByTestId`. `playwright.config.ts` sets `testIdAttribute: 'data-test'` so it matches SauceDemo's `data-test` attributes. The side-menu button has no `data-test` attribute, so it is found with `getByRole`.
- Only Chromium is configured. There is no CI or Docker setup.
