import { Page, Locator } from '@playwright/test';

export class SideNavPage {
    readonly page: Page;

    readonly toggleButton: Locator;
    readonly signOutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.toggleButton = page.getByTestId('sidenav-toggle');
        this.signOutButton = page.getByTestId('sidenav-signout');
    }

    async signOut() {
        if (!await this.signOutButton.isVisible()) {
            await this.toggleButton.click();
        }
        await this.signOutButton.click();
    }
}
