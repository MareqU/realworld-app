import { expect } from '@playwright/test';
import { UserSettingsPage } from '../../pages/UserSettingsPage';

export class UserSettingsValidations {
    private readonly page: UserSettingsPage;

    constructor(page: UserSettingsPage) {
        this.page = page;
    }

    async expectFirstNameRequired() {
        await expect(this.page.firstNameError).toBeVisible();
        await expect(this.page.firstNameError).toContainText('Enter a first name');
    }

    async expectLastNameRequired() {
        await expect(this.page.lastNameError).toBeVisible();
        await expect(this.page.lastNameError).toContainText('Enter a last name');
    }

    async expectPhoneInvalid() {
        await expect(this.page.phoneError).toBeVisible();
        await expect(this.page.phoneError).toContainText('Phone number is not valid');
    }

    async expectSubmitDisabled() {
        await expect(this.page.submitButton).toBeDisabled();
    }
}
