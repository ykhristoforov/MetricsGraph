import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const fixtures = (...parts) => path.join(process.cwd(), 'tests/fixtures', ...parts);

test('downloads a self-contained offline HTML export', async ({ page, context }) => {
  await page.goto('/');
  await page.setInputFiles('#workbookInput', fixtures('valid-flow-efficiency.xlsx'));
  await expect(page.locator('#exportButton')).toBeEnabled();

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#exportButton').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('flow-efficiency.html');
  const exportDir = path.join(process.cwd(), 'test-results', 'exports');
  mkdirSync(exportDir, { recursive: true });
  const exportPath = path.join(exportDir, download.suggestedFilename());
  await download.saveAs(exportPath);

  await context.setOffline(true);
  const exportPage = await context.newPage();
  await exportPage.goto(`file://${exportPath}`);
  await expect(exportPage.locator('.barlayer')).toBeVisible();
  await expect(exportPage.locator('.scatterlayer')).toBeVisible();
});
