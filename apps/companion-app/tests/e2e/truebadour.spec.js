import { test, expect } from '@playwright/test';

test.describe('Truebadour Widget', () => {
  test.beforeEach(async ({ page }) => {
    // Bypass onboarding
    await page.addInitScript(() => {
      window.localStorage.setItem('vv_onboarded', '"1"');
    });
    
    await page.goto('/');
  });

  test('Widget can be opened via UnifiedAssistantMenu', async ({ page }) => {
    // Wait for FAB to appear (it should be Assistant)
    await expect(page.locator('button:has-text("Assistant")')).toBeVisible({ timeout: 10000 });
    
    // Click the FAB
    await page.click('button:has-text("Assistant")');

    // Wait for the menu options to expand, specifically AI Mentor
    await expect(page.locator('button:has-text("AI Mentor")')).toBeVisible({ timeout: 5000 });
    
    // Click to open Truebadour Widget
    await page.click('button:has-text("AI Mentor")');

    // Verify Truebadour widget is open by looking for its aria-label or its class
    await expect(page.locator('[aria-label="Truebadour AI Companion"]')).toBeVisible({ timeout: 5000 });
  });
});

