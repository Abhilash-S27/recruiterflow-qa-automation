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

test('POST creates a user named morpheus', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    headers: { 'x-api-key': apiKey },
    data: { name: 'morpheus', job: 'leader' },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect(body.name).toBe('morpheus');
});

test('GET user 23 returns 404', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/23', {
    headers: { 'x-api-key': apiKey },
  });

  expect(response.status()).toBe(404);
});