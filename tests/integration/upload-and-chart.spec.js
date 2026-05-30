import { expect, test } from '@playwright/test';
import path from 'node:path';

const fixtures = (...parts) => path.join(process.cwd(), 'tests/fixtures', ...parts);

test('valid upload renders combined chart and enables export', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('#workbookInput', fixtures('valid-flow-efficiency.xlsx'));
  await expect(page.locator('#dashboard')).toBeVisible();
  await expect(page.getByText('Flow Efficiency · Lead & Cycle Time')).toBeVisible();
  await expect(page.locator('#exportButton')).toBeEnabled();
  await expect(page.locator('.barlayer')).toBeVisible();
  await expect(page.locator('.scatterlayer')).toBeVisible();
  await expect(page.locator('#chart')).not.toContainText('График появится');
});

test('invalid uploads show user-facing errors and keep export unavailable', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('#workbookInput', fixtures('invalid-format.txt'));
  await expect(page.getByRole('alert')).toContainText('Ошибка формата файла');
  await expect(page.locator('#exportButton')).toBeDisabled();

  await page.setInputFiles('#workbookInput', fixtures('missing-columns.xlsx'));
  await expect(page.getByRole('alert')).toContainText('Ошибка содержимого файла');
  await expect(page.locator('#exportButton')).toBeDisabled();
});

test('valid upload renders within 5 seconds', async ({ page }) => {
  await page.goto('/');
  const started = Date.now();
  await page.setInputFiles('#workbookInput', fixtures('valid-flow-efficiency.xlsx'));
  await expect(page.locator('.barlayer')).toBeVisible();
  expect(Date.now() - started).toBeLessThan(5000);
});
