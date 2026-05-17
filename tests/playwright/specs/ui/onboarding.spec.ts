import { test, expect } from '../../fixtures';

test.describe('Onboarding', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: Complete new user onboarding flow by creating a bank account | Suite: UI/Onboarding
    test('Complete new user onboarding flow by creating a bank account', async ({ page, bankAccountsPage, onboardingPage, sideNav }) => {
        await bankAccountsPage.interceptEmptyBankAccounts();
        await page.goto('/');

        await expect(onboardingPage.dialog).toBeVisible();
        await expect(sideNav.notificationsCount).toBeAttached();

        await onboardingPage.nextButton.click();
        await expect(onboardingPage.dialogTitle).toContainText('Create Bank Account');

        await onboardingPage.fillBankAccount('Test Bank', '987654321', '123456789');
        await onboardingPage.submitButton.click();

        await expect(onboardingPage.dialogTitle).toContainText('Finished');
        await expect(onboardingPage.dialogContent).toContainText("You're all set!");

        await onboardingPage.nextButton.click();
        await expect(page.getByTestId('transaction-list')).toBeVisible();
    });

});
