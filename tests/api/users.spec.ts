import { test, expect } from '@playwright/test';

const apiKey = process.env.REQRES_API_KEY ?? '';

test('GET user 2 returns 200 and an email', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2', {
    headers: { 'x-api-key': apiKey },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.email).toBeTruthy();
});