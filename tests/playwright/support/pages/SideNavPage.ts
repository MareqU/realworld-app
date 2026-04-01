import { Page, Locator } from '@playwright/test';

export class SideNavPage {
    readonly page: Page;

    readonly toggleButton: Locator;
    readonly signOutButton: Locator;
    readonly bankAccounts: Locator;
    readonly notificationsCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toggleButton = page.getByTestId('sidenav-toggle');
        this.signOutButton = page.getByTestId('sidenav-signout');
        this.bankAccounts = page.getByTestId('sidenav-bankaccounts');
        this.notificationsCount = page.getByTestId('nav-top-notifications-count');
    }

    async signOut() {
        if (!await this.signOutButton.isVisible()) {
            await this.toggleButton.click();
        }
        await this.signOutButton.click();
    }
}
