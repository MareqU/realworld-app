import { Page, Locator } from '@playwright/test';

export class SideNavPage {
    readonly page: Page;

    readonly toggleButton: Locator;
    readonly signOutButton: Locator;
    readonly bankAccounts: Locator;
    readonly notificationsCount: Locator;
    readonly homeLink: Locator;
    readonly myAccountLink: Locator;
    readonly notificationsLink: Locator;
    readonly userFullName: Locator;
    readonly username: Locator;
    readonly balance: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toggleButton = page.getByTestId('sidenav-toggle');
        this.signOutButton = page.getByTestId('sidenav-signout');
        this.bankAccounts = page.getByTestId('sidenav-bankaccounts');
        this.notificationsCount = page.getByTestId('nav-top-notifications-count');
        this.homeLink = page.getByTestId('sidenav-home');
        this.myAccountLink = page.getByTestId('sidenav-user-settings');
        this.notificationsLink = page.getByTestId('sidenav-notifications');
        this.userFullName = page.getByTestId('sidenav-user-full-name');
        this.username = page.getByTestId('sidenav-username');
        this.balance = page.getByTestId('sidenav-user-balance');
    }

    async signOut() {
        if (!await this.signOutButton.isVisible()) {
            await this.toggleButton.click();
        }
        await this.signOutButton.click();
    }
}
