import { test, expect } from '../../fixtures';

test.describe('Navigation', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: Navigate to all main sections using the sidebar navigation links | Suite: UI/Navigation
    test('Navigate to all main sections using the sidebar navigation links', async ({ page, sideNav, transactionFeedPage }) => {
        await page.goto('/');

        await sideNav.homeLink.click();
        await expect(page).toHaveURL('/');
        await expect(page.getByTestId('transaction-list')).toBeVisible();

        await sideNav.myAccountLink.click();
        await expect(page).toHaveURL('/user/settings');

        await sideNav.bankAccounts.click();
        await expect(page).toHaveURL('/bankaccounts');

        await sideNav.notificationsLink.click();
        await expect(page).toHaveURL('/notifications');
    });

    // Qase: Verify account balance and username are displayed in the sidebar | Suite: UI/Navigation
    test('Verify account balance and username are displayed in the sidebar', async ({ page, sideNav }) => {
        await page.goto('/');

        await expect(sideNav.userFullName).toBeVisible();
        await expect(sideNav.username).toBeVisible();
        await expect(sideNav.balance).toBeVisible();

        await sideNav.myAccountLink.click();
        await expect(sideNav.userFullName).toBeVisible();
        await expect(sideNav.balance).toBeVisible();

        await sideNav.bankAccounts.click();
        await expect(sideNav.userFullName).toBeVisible();
        await expect(sideNav.balance).toBeVisible();
    });

});
