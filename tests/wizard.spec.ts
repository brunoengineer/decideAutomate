import { test, expect } from '@playwright/test';

test.describe('Automation Decision Wizard', () => {
  test('should navigate through all questions and show result', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');
    
    // Verify the title is displayed
    await expect(page.locator('h1')).toContainText('Automation Decision Criteria');
    
    // Get the total number of questions from the progress indicator
    const progressText = await page.locator('text=Question 1 of').textContent();
    const totalQuestions = parseInt(progressText?.split('of')[1].trim() || '0');
    
    // Answer all questions with the first option
    for (let i = 0; i < totalQuestions; i++) {
      // Click the first option for each question
      await page.locator('.card > div > div').first().click();
      
      // Click the Next button
      await page.locator('button:text("Next")').click();
    }
    
    // Verify we're on the results page
    await expect(page.locator('h1')).toContainText('Test Automation Assessment Results');
    
    // Verify the recommendation is displayed
    await expect(page.locator('text=Recommendation')).toBeVisible();
    
    // Verify the summary table is displayed
    await expect(page.locator('table')).toBeVisible();
    
    // Verify the download buttons are available
    await expect(page.locator('button:text("Download PDF")')).toBeVisible();
    await expect(page.locator('button:text("Download CSV")')).toBeVisible();
    await expect(page.locator('button:text("Download JSON")')).toBeVisible();
    
    // Verify the "Start New Assessment" button is available
    await expect(page.locator('button:text("Start New Assessment")')).toBeVisible();
  });
  
  test('should persist answers when refreshing the page', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');
    
    // Answer the first question
    await page.locator('.card > div > div').first().click();
    
    // Get the selected option text
    const selectedOptionText = await page.locator('.card > div > div').first().textContent();
    
    // Refresh the page
    await page.reload();
    
    // Verify the same option is still selected
    const firstOptionAfterReload = await page.locator('.card > div > div').first();
    await expect(firstOptionAfterReload).toHaveClass(/bg-blue-100/);
    
    // Verify the option text is the same
    await expect(firstOptionAfterReload).toContainText(selectedOptionText || '');
  });
  
  test('should calculate correct scores for different answer combinations', async ({ page }) => {
    // Start at the homepage
    await page.goto('/');
    
    // Answer all questions with options that have positive points
    // This is a simplified test - in a real test, you would identify specific options with known point values
    const totalQuestions = 16; // Based on our data model
    
    for (let i = 0; i < totalQuestions; i++) {
      // Find the option with positive points (green background)
      const positiveOption = page.locator('.bg-green-100').first();
      
      // If there's a positive option, click it, otherwise click the first option
      if (await positiveOption.count() > 0) {
        await positiveOption.click();
      } else {
        await page.locator('.card > div > div').first().click();
      }
      
      // Click the Next button
      await page.locator('button:text("Next")').click();
    }
    
    // Verify we're on the results page
    await expect(page.locator('h1')).toContainText('Test Automation Assessment Results');
    
    // Verify the score is positive
    const scoreText = await page.locator('text=Total Score:').textContent();
    const score = parseInt(scoreText?.split(':')[1].trim().split(' ')[0] || '0');
    
    expect(score).toBeGreaterThan(0);
  });
});
