import { Page, Locator } from '@playwright/test';

export class NotificationsPage {
    readonly page: Page;
    readonly notificationsList: Locator;
    readonly notificationItems: Locator;
    readonly emptyListHeader: Locator;
    readonly notificationsBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.notificationsList = page.getByTestId('notifications-list');
        this.notificationItems = page.locator('[data-test^="notification-list-item"]');
        this.emptyListHeader = page.getByTestId('empty-list-header');
        this.notificationsBadge = page.getByTestId('nav-top-notifications-count');
    }

    async goto() {
        await this.page.goto('/notifications');
    }

    async interceptEmptyNotifications() {
        await this.page.route('**/notifications*', async (route) => {
            const resourceType = route.request().resourceType();
            if (resourceType !== 'fetch' && resourceType !== 'xhr') {
                await route.continue();
                return;
            }
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ results: [], pageData: { total: 0, pages: 0 } }),
            });
        });
    }
}
