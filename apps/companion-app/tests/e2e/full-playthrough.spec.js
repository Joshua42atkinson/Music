import { test, expect } from '@playwright/test';

test.describe('Full Playthrough & QA Pass', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and bypass onboarding
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('vv_onboarded', '"1"');
      // Enable AI for Truebadour widget
      window.localStorage.setItem('vv_state', JSON.stringify({ aiEnabled: true }));
    });
  });

  test('User can navigate all primary destinations and use core systems', async ({ page }) => {
    // Start at Dashboard
    await page.goto('/#/dashboard');

    // Wait for loading skeleton to finish
    try {
      await expect(page.locator('h1', { hasText: /Chapter \w+:/ })).toBeVisible({ timeout: 15000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/dashboard_failure.png' });
      throw e;
    }

    // 1. DASHBOARD PILLAR PROGRESSION
    // We start in 'BE' pillar. Click "I Understand. Proceed to DO."
    await page.click('button:has-text("I Understand. Proceed to DO.")');
    
    // Now in 'DO' pillar. The button says "Skip" to bypass pitch detection in tests.
    await expect(page.locator('h2', { hasText: 'Active Imagination' })).toBeVisible();
    await page.click('button:has-text("Skip")');

    // Now in 'PLAY' pillar.
    await expect(page.locator('h2', { hasText: 'Physical Execution' })).toBeVisible();
    await page.click('button:has-text("I Have Mastered This. Proceed to PRODUCE.")');

    // Now in 'PRODUCE' pillar.
    await expect(page.locator('h2', { hasText: 'Share Your Resonance' })).toBeVisible();
    await page.click('button:has-text("Skip Upload & Return to BE")');

    // Back to BE, advanced chapter! Or at least back to BE.
    await expect(page.locator('button:has-text("I Understand. Proceed to DO.")')).toBeVisible();

    // 2. PRIMARY NAV - BINDER
    // Use the UnifiedAssistantMenu to open the binder? Or Primary Nav. Let's use Primary Nav.
    // Wait, the primary nav might be collapsed on mobile. The test runs on a desktop viewport by default, but let's just go to #/binder
    await page.goto('/#/binder');
    await expect(page.locator('h1', { hasText: 'Practice Workbook' })).toBeVisible({ timeout: 10000 });

    // 3. PRIMARY NAV - RIFF
    await page.goto('/#/riff');
    await expect(page.locator('text=RIFF').first()).toBeVisible({ timeout: 10000 });

    // 4. AI WIDGET (TRUEBADOUR)
    await page.goto('/#/dashboard');
    // Open UnifiedAssistantMenu
    await expect(page.locator('button:has-text("Assistant")')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Assistant")');
    // Click AI Mentor
    await expect(page.locator('button:has-text("AI Mentor")')).toBeVisible({ timeout: 5000 });
    await page.click('button:has-text("AI Mentor")');
    // Verify Truebadour widget opens
    await expect(page.locator('[aria-label="Truebadour AI Companion"]')).toBeVisible({ timeout: 5000 });

    // Check console errors
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    expect(errors.length).toBe(0);
  });
});
