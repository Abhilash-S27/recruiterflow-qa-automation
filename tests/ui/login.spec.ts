import { test, expect } from '@playwright/test';

test('standard user can log in and see the Products page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('title')).toHaveText('Products');
});