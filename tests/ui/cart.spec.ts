import { test, expect } from '@playwright/test';

test('adding a product to the cart shows 1 on the cart badge', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();

  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});