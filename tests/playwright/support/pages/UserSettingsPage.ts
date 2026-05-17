import { Page, Locator } from '@playwright/test';

export class UserSettingsPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly submitButton: Locator;
    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly phoneError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByTestId('user-settings-firstName-input');
        this.lastNameInput = page.getByTestId('user-settings-lastName-input');
        this.emailInput = page.getByTestId('user-settings-email-input');
        this.phoneInput = page.getByTestId('user-settings-phoneNumber-input');
        this.submitButton = page.getByTestId('user-settings-submit');
        this.firstNameError = page.locator('#user-settings-firstName-input-helper-text');
        this.lastNameError = page.locator('#user-settings-lastName-input-helper-text');
        this.phoneError = page.locator('#user-settings-phoneNumber-input-helper-text');
    }

    async goto() {
        await this.page.goto('/user/settings');
    }
}
