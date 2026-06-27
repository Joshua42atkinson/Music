import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow (First Session)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure onboarding shows
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('New user can complete the First Session onboarding', async ({ page }) => {
    await page.goto('/');

    // 1. Landing Screen
    await expect(page.locator('button.premium-button')).toBeVisible({ timeout: 10000 });
    await page.click('button.premium-button');

    // 2. First Session - Welcome
    await expect(page.locator('h1', { hasText: 'Voix Vive' })).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Let’s Begin")');

    // 3. First Session - Tune
    await expect(page.locator('h2', { hasText: 'Tune Your Guitar' })).toBeVisible();
    await page.click('button:has-text("Skip tuning")');

    // 4. First Session - Listen
    await expect(page.locator('h2', { hasText: 'Hear the Foundation' })).toBeVisible();
    await page.click('button:has-text("I hear it. Let me try.")');

    // 5. First Session - Play
    await expect(page.locator('h2', { hasText: 'Play Your First Note' })).toBeVisible();
    await page.click('button:has-text("I did it!")'); 

    // 6. First Session - Reflect
    await expect(page.locator('h2', { hasText: 'You Did It' })).toBeVisible();
    await page.click('button:has-text("Enter the Academy")');

    // 7. Reaches C-Scale Hub
    await expect(page).toHaveURL(/.*#\/c-scale/);
    
    // Check localStorage was set
    const onboarded = await page.evaluate(() => window.localStorage.getItem('vv_onboarded'));
    expect(onboarded).toBe('1');
  });

  test('User can skip onboarding completely', async ({ page }) => {
    await page.goto('/#/start');

    // Skip button is at the top left
    await expect(page.locator('button:has-text("Skip")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Skip")');

    await expect(page).toHaveURL(/.*#\/c-scale/);
    
    const onboarded = await page.evaluate(() => window.localStorage.getItem('vv_onboarded'));
    expect(onboarded).toBe('1');
  });
});
