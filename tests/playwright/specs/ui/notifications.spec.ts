import { test, expect } from '../../fixtures';

test.describe('Notifications', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: View notifications page showing empty state for a new user | Suite: UI/Notifications
    test('View notifications page showing empty state for a new user', async ({ page, notificationsPage }) => {
        await notificationsPage.interceptEmptyNotifications();
        await notificationsPage.goto();

        await expect(page).toHaveURL('/notifications');
        await expect(notificationsPage.emptyListHeader).toBeVisible();
        await expect(notificationsPage.notificationItems).toHaveCount(0);
    });

    // Qase: View notification list after receiving a transaction notification | Suite: UI/Notifications
    test('View notification list after receiving a transaction notification', async ({ page, notificationsPage }) => {
        await notificationsPage.goto();

        await expect(page).toHaveURL('/notifications');
        await expect(notificationsPage.notificationItems.first()).toBeVisible();
    });

});
