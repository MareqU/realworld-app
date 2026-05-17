import { test, expect } from '../../fixtures';

test.describe('Transaction Feed', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: Filter transaction feed by date range | Suite: UI/Transaction Feed
    test('Filter transaction feed by date range', async ({ transactionFeedPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionList).toBeVisible();

        await transactionFeedPage.dateFilterButton.click();
        await expect(transactionFeedPage.dateRangeDrawer).toBeVisible();

        await transactionFeedPage.selectDateRange();
        await transactionFeedPage.dateClearButton.click();
        await expect(transactionFeedPage.transactionList).toBeVisible();
    });

    // Qase: Switch transaction feed to Friends tab to view contact transactions | Suite: UI/Transaction Feed
    test('Switch transaction feed to Friends tab to view contact transactions', async ({ page, transactionFeedPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionList).toBeVisible();

        await transactionFeedPage.friendsTab.click();
        await expect(page).toHaveURL('/contacts');
        await expect(transactionFeedPage.transactionList).toBeVisible();
    });

    // Qase: Switch transaction feed to Mine tab to view personal transactions | Suite: UI/Transaction Feed
    test('Switch transaction feed to Mine tab to view personal transactions', async ({ page, transactionFeedPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionList).toBeVisible();

        await transactionFeedPage.mineTab.click();
        await expect(page).toHaveURL('/personal');
        await expect(transactionFeedPage.transactionList).toBeVisible();
    });

    // Qase: Filter transaction feed by amount range using slider controls | Suite: UI/Transaction Feed
    test('Filter transaction feed by amount range using slider controls', async ({ transactionFeedPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionList).toBeVisible();

        await transactionFeedPage.amountFilterButton.click();
        await expect(transactionFeedPage.amountRangeDrawer).toBeVisible();

        await transactionFeedPage.amountClearButton.click();
        await expect(transactionFeedPage.transactionList).toBeVisible();
    });

    // Qase: Clear amount range filter to restore full transaction feed | Suite: UI/Transaction Feed
    test('Clear amount range filter to restore full transaction feed', async ({ page, transactionFeedPage }) => {
        await transactionFeedPage.goto();
        await expect(transactionFeedPage.transactionList).toBeVisible();

        await transactionFeedPage.amountFilterButton.click();
        await expect(transactionFeedPage.amountRangeDrawer).toBeVisible();

        await transactionFeedPage.amountClearButton.click();
        
        await page.waitForTimeout(2000)
        await page.keyboard.press('Escape');                                                                                                                                                                                                                                         
        await expect(transactionFeedPage.amountRangeDrawer).not.toBeVisible();
        await expect(transactionFeedPage.transactionList).toBeVisible();
    });

    // Qase: Verify empty state on Friends tab when user has no contacts | Suite: UI/Transaction Feed
    test('Verify empty state on Friends tab when user has no contacts', async ({ page, transactionFeedPage }) => {
        await transactionFeedPage.interceptEmptyContactsTransactions();
        await transactionFeedPage.goto();

        await transactionFeedPage.friendsTab.click();
        await expect(page).toHaveURL('/contacts');
        await expect(transactionFeedPage.emptyListHeader).toBeVisible();
    });

});
