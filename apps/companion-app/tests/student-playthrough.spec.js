import { test, expect } from '@playwright/test';

test.describe('Student Playthrough', () => {
  test('should navigate from landing to C-Scale journey and complete the first chapter', async ({ page }) => {
    // Log console and errors to see why the page isn't loading
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));

    // 1. Load the landing page
    await page.goto('/');
    
    // Check if there is an error boundary or what is rendered
    console.log('HTML CONTENT:', await page.content());
    
    // Verify landing page is loaded by waiting for the portal card
    const cScalePortal = page.locator('.portal-card:has-text("The C-Scale Journey")');
    await expect(cScalePortal).toBeVisible({ timeout: 10000 });

    // 2. Click on the C-Scale Journey portal
    await cScalePortal.click();

    // Wait for the C-Scale Hub to load
    await expect(page.locator('text=The C Scale Journey')).toBeVisible();

    // 3. Progress through the BE phase
    await expect(page.locator('text=Phase 1: BE')).toBeVisible();
    
    const moveToDoButton = page.locator('button:has-text("Move to DO")');
    await expect(moveToDoButton).toBeVisible();
    await moveToDoButton.click();

    // 4. Progress through the DO phase
    await expect(page.locator('text=Phase 2: DO')).toBeVisible();
    
    // In DO phase, we can either match notes or "Skip to PLAY →"
    const skipToPlayButton = page.locator('button:has-text("Skip to PLAY")');
    await expect(skipToPlayButton).toBeVisible();
    await skipToPlayButton.click();

    // 5. Progress through the PLAY phase
    await expect(page.locator('text=Phase 3: PLAY')).toBeVisible();
    
    const completeChapterButton = page.locator('button:has-text("Complete Chapter")');
    await expect(completeChapterButton).toBeVisible();
    await completeChapterButton.click();

    // 6. Verify that the progress updated (e.g. "1/12 ✓" or a toast appears)
    // The CScaleHub shows completed count like "1/12 ✓"
    await expect(page.locator('text=1/12 ✓')).toBeVisible();
  });
});
