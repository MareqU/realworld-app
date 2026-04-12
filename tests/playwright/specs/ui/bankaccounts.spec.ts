import { test, expect } from '../../fixtures';

test.describe('Bank Accounts', () => {

    test.beforeEach(async ({ seedDatabase, page, signInPage }) => {
        await seedDatabase();
        await signInPage.login(
            process.env.TEST_USER,
            process.env.TEST_PASS
        );
        await page.waitForURL('/');
    });
    

    test('creates a new bank account', async ({ page, bankAccountsPage, bankAccountsValidations, sideNav }) => {

        await page.goto('/');
        //await page.getByTestId('sidenav-bankaccounts').click();
        await sideNav.bankAccounts.click();

        await bankAccountsPage.newButton.click();
        await expect(page).toHaveURL('/bankaccounts/new');

        await bankAccountsPage.createBankAccount('The Best Bank', '987654321', '123456789');

        await bankAccountsValidations.expectBankAccountCreated('The Best Bank', 2);
    });

    test('should display bank account form errors', async ({ bankAccountsPage, bankAccountsValidations }) => {

        await bankAccountsPage.gotoNewForm();

        // Bank name - required
        await bankAccountsPage.bankNameInput.fill('The');
        await bankAccountsPage.bankNameInput.clear();
        await bankAccountsPage.bankNameInput.blur();
        await bankAccountsValidations.expectBankNameRequired();

        // Bank name - min 5 characters
        await bankAccountsPage.bankNameInput.fill('The');
        await bankAccountsPage.bankNameInput.blur();
        await bankAccountsValidations.expectBankNameTooShort();

        // Routing number - required
        await bankAccountsPage.routingNumberInput.focus();
        await bankAccountsPage.routingNumberInput.blur();
        await bankAccountsValidations.expectRoutingNumberRequired();

        // Routing number - min 9 digits
        await bankAccountsPage.routingNumberInput.fill('12345678');
        await bankAccountsPage.routingNumberInput.blur();
        await bankAccountsValidations.expectRoutingNumberTooShort();

        // Routing number - valid clears error
        await bankAccountsPage.routingNumberInput.clear();
        await bankAccountsPage.routingNumberInput.fill('123456789');
        await bankAccountsPage.routingNumberInput.blur();
        await bankAccountsValidations.expectRoutingNumberErrorCleared();

        // Account number - required
        await bankAccountsPage.accountNumberInput.focus();
        await bankAccountsPage.accountNumberInput.blur();
        await bankAccountsValidations.expectAccountNumberRequired();

        // Account number - min 9 digits
        await bankAccountsPage.accountNumberInput.fill('12345678');
        await bankAccountsPage.accountNumberInput.blur();
        await bankAccountsValidations.expectAccountNumberTooShort();

        // Account number - valid 9 digits clears error
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('123456789');
        await bankAccountsPage.accountNumberInput.blur();
        await bankAccountsValidations.expectAccountNumberErrorCleared();

        // Account number - valid 12 digits clears error
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('123456789111');
        await bankAccountsPage.accountNumberInput.blur();
        await bankAccountsValidations.expectAccountNumberErrorCleared();

        // Account number - max 12 digits
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('1234567891111');
        await bankAccountsPage.accountNumberInput.blur();
        await bankAccountsValidations.expectAccountNumberTooLong();

        await bankAccountsValidations.expectSubmitDisabled();
    });

    test('soft deletes a bank account', async ({ bankAccountsPage, bankAccountsValidations }) => {

        await bankAccountsPage.goto();
        await bankAccountsPage.deleteButton.first().click();

        await bankAccountsValidations.expectBankAccountDeleted();
    });

    test('renders an empty bank account list state with onboarding modal', async ({ bankAccountsPage, bankAccountsValidations, onboardingPage, sideNav }) => {
        await bankAccountsPage.interceptEmptyBankAccounts();
        await bankAccountsPage.goto();

        await bankAccountsValidations.expectEmptyState();
        await expect(onboardingPage.dialog).toBeVisible();
        await expect(sideNav.notificationsCount).toBeAttached();
    });

});
