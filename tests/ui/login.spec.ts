import { test, expect } from '@playwright/test';

test('standard user can log in and see the Products page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('locked out user sees an error', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByTestId('username').fill('locked_out_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toContainText('locked out');
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