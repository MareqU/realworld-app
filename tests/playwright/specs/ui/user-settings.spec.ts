import { test, expect } from '../../fixtures';

test.describe('User Settings', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: Update user profile information from My Account page | Suite: UI/User Settings
    test('Update user profile information from My Account page', async ({ page, userSettingsPage }) => {
        await userSettingsPage.goto();
        await expect(userSettingsPage.firstNameInput).toBeVisible();

        await userSettingsPage.firstNameInput.clear();
        await userSettingsPage.firstNameInput.fill('UpdatedFirst');

        await userSettingsPage.emailInput.clear();
        await userSettingsPage.emailInput.fill('updated@example.com');

        await userSettingsPage.phoneInput.clear();
        await userSettingsPage.phoneInput.fill('555-867-5309');

        await expect(userSettingsPage.submitButton).toBeEnabled();
        await userSettingsPage.submitButton.click();

        await page.reload();
        await expect(userSettingsPage.firstNameInput).toHaveValue('UpdatedFirst');
    });

    // Qase: Submit user settings form with empty required fields shows validation errors | Suite: UI/User Settings
    test('Submit user settings form with empty required fields shows validation errors', async ({ userSettingsPage, userSettingsValidations }) => {
        await userSettingsPage.goto();
        await expect(userSettingsPage.firstNameInput).toBeVisible();

        await userSettingsPage.firstNameInput.clear();
        await userSettingsPage.firstNameInput.blur();
        await userSettingsValidations.expectFirstNameRequired();

        await userSettingsPage.lastNameInput.clear();
        await userSettingsPage.lastNameInput.blur();
        await userSettingsValidations.expectLastNameRequired();

        await userSettingsValidations.expectSubmitDisabled();
    });

    // Qase: Submit user settings with invalid phone number format shows validation error | Suite: UI/User Settings
    test('Submit user settings with invalid phone number format shows validation error', async ({ userSettingsPage, userSettingsValidations }) => {
        await userSettingsPage.goto();
        await expect(userSettingsPage.phoneInput).toBeVisible();

        await userSettingsPage.phoneInput.clear();
        await userSettingsPage.phoneInput.fill('not-a-phone');
        await userSettingsPage.phoneInput.blur();
        await userSettingsValidations.expectPhoneInvalid();

        await userSettingsPage.phoneInput.clear();
        await userSettingsPage.phoneInput.fill('555-867-5309');
        await userSettingsPage.phoneInput.blur();
        await expect(userSettingsPage.phoneError).not.toBeVisible();
    });

});
