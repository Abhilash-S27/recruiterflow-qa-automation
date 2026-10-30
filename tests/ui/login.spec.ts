import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('standard user can log in and see the Products page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('locked out user sees an error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('locked_out_user', 'secret_sauce');

  await expect(loginPage.errorMessage).toContainText('locked out');
});

test('logged in user can log out and returns to the login page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();

  await expect(page.getByTestId('login-button')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
