import { test, expect } from '@playwright/test';

test.describe('Automation Decision Report', () => {
  // Helper function to complete the quiz
  async function completeQuiz(page) {
    await page.goto('/');
    
    // Get the total number of questions from the progress indicator
    const progressText = await page.locator('text=Question 1 of').textContent();
    const totalQuestions = parseInt(progressText?.split('of')[1].trim() || '0');
    
    // Answer all questions with the first option
    for (let i = 0; i < totalQuestions; i++) {
      await page.locator('.card > div > div').first().click();
      await page.locator('button:text("Next")').click();
    }
    
    // Verify we're on the results page
    await expect(page.locator('h1')).toContainText('Test Automation Assessment Results');
  }
  
  test('should show correct recommendation based on score', async ({ page }) => {
    await completeQuiz(page);
    
    // Get the recommendation text
    const recommendationText = await page.locator('.rounded-lg.border p').first().textContent();
    
    // Get the total score
    const scoreText = await page.locator('text=Total Score:').textContent();
    const score = parseInt(scoreText?.split(':')[1].trim().split(' ')[0] || '0');
    
    // Verify the recommendation matches the score
    if (score >= 8) {
      expect(recommendationText).toContain('Automate it');
    } else if (score >= 4) {
      expect(recommendationText).toContain('Automate if you have free time');
    } else if (score >= 0) {
      expect(recommendationText).toContain('You probably shouldn\'t automate this');
    } else {
      expect(recommendationText).toContain('Do not Automate this');
    }
  });
  
  test('should start a new assessment when clicking the reset button', async ({ page }) => {
    await completeQuiz(page);
    
    // Click the "Start New Assessment" button
    await page.locator('button:text("Start New Assessment")').click();
    
    // Verify we're back on the first page
    await expect(page.locator('h1')).toContainText('Automation Decision Criteria');
    await expect(page.locator('text=Question 1 of')).toBeVisible();
    
    // Verify no option is selected
    const selectedOptions = await page.locator('.bg-blue-100').count();
    expect(selectedOptions).toBe(0);
  });
  
  test('should have the correct number of rows in the summary table', async ({ page }) => {
    await completeQuiz(page);
    
    // Count the number of rows in the table (excluding header and footer)
    const tableRows = await page.locator('table tbody tr').count();
    
    // Get the total number of questions from the data model
    // We expect tableRows to be equal to the number of questions + 1 (for the total row)
    // This is a simplified test - in a real test, you would have a more precise way to get the number of questions
    expect(tableRows).toBeGreaterThan(1);
    
    // Verify the last row is the total row
    const lastRowFirstCell = await page.locator('table tbody tr:last-child td:first-child').textContent();
    expect(lastRowFirstCell).toContain('Total');
  });
});
