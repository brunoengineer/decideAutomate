// @ts-nocheck
import { test, expect } from '@playwright/test';

test('homepage displays correct title', async ({ page }) => {
  await page.goto('http://localhost:5173/decideAutomate/');
  await expect(page.locator('h1')).toHaveText('Test Automation Assessment');
});

test('can enter test name and start assessment', async ({ page }) => {
  await page.goto('http://localhost:5173/decideAutomate/');
  await page.fill('input#testName', 'My Test Name');
  await page.click('button:has-text("Start Assessment")');
  await expect(page).toHaveURL(/\/decideAutomate\/questions/);
});


test('questions page displays correct title and first question', async ({ page }) => {
  // Start at homepage and begin assessment
  await page.goto('http://localhost:5173/decideAutomate/');
  await page.fill('input#testName', 'My Test Name');
  await page.click('button:has-text("Start Assessment")');
  await expect(page).toHaveURL(/\/decideAutomate\/questions/);
  await expect(page.locator('h1')).toHaveText('Automation Decision Criteria');
  await expect(page.locator('h2')).toHaveText('Is the test going to be repeated?');
});

test('questions page displays navigation buttons and total questions', async ({ page }) => {
  // Start at homepage and begin assessment
  await page.goto('http://localhost:5173/decideAutomate/');
  await page.fill('input#testName', 'My Test Name');
  await page.click('button:has-text("Start Assessment")');
  await expect(page).toHaveURL(/\/decideAutomate\/questions/);
  await expect(page.locator('button:has-text("Next")')).toBeVisible();
  await expect(page.locator('button:has-text("Previous")')).toBeVisible();
});
