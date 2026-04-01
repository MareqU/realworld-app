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
    

    test('creates a new bank account', async ({ page, bankAccountsPage }) => {

        await page.goto('/');
        await page.getByTestId('sidenav-bankaccounts').click();

        await bankAccountsPage.newButton.click();
        await expect(page).toHaveURL('/bankaccounts/new');

        await bankAccountsPage.bankNameInput.fill('The Best Bank');
        await bankAccountsPage.routingNumberInput.fill('987654321');
        await bankAccountsPage.accountNumberInput.fill('123456789');
        await bankAccountsPage.submitButton.click();

        await expect(bankAccountsPage.listItems).toHaveCount(2);
        await expect(bankAccountsPage.listItems.nth(1)).toContainText('The Best Bank');
    });

    test('should display bank account form errors', async ({ page, bankAccountsPage }) => {

        await bankAccountsPage.goto();
        await bankAccountsPage.newButton.click();

        // Bank name - required
        await bankAccountsPage.bankNameInput.fill('The');
        await bankAccountsPage.bankNameInput.clear();
        await bankAccountsPage.bankNameInput.blur();
        await expect(bankAccountsPage.bankNameError).toBeVisible();
        await expect(bankAccountsPage.bankNameError).toContainText('Enter a bank name');

        // Bank name - min 5 characters
        await bankAccountsPage.bankNameInput.fill('The');
        await bankAccountsPage.bankNameInput.blur();
        await expect(bankAccountsPage.bankNameError).toBeVisible();
        await expect(bankAccountsPage.bankNameError).toContainText('Must contain at least 5 characters');

        // Routing number - required
        await bankAccountsPage.routingNumberInput.focus();
        await bankAccountsPage.routingNumberInput.blur();
        await expect(bankAccountsPage.routingNumberError).toBeVisible();
        await expect(bankAccountsPage.routingNumberError).toContainText('Enter a valid bank routing number');

        // Routing number - min 9 digits
        await bankAccountsPage.routingNumberInput.fill('12345678');
        await bankAccountsPage.routingNumberInput.blur();
        await expect(bankAccountsPage.routingNumberError).toBeVisible();
        await expect(bankAccountsPage.routingNumberError).toContainText('Must contain a valid routing number');

        // Routing number - valid clears error
        await bankAccountsPage.routingNumberInput.clear();
        await bankAccountsPage.routingNumberInput.fill('123456789');
        await bankAccountsPage.routingNumberInput.blur();
        await expect(bankAccountsPage.routingNumberError).not.toBeAttached();

        // Account number - required
        await bankAccountsPage.accountNumberInput.focus();
        await bankAccountsPage.accountNumberInput.blur();
        await expect(bankAccountsPage.accountNumberError).toBeVisible();
        await expect(bankAccountsPage.accountNumberError).toContainText('Enter a valid bank account number');

        // Account number - min 9 digits
        await bankAccountsPage.accountNumberInput.fill('12345678');
        await bankAccountsPage.accountNumberInput.blur();
        await expect(bankAccountsPage.accountNumberError).toBeVisible();
        await expect(bankAccountsPage.accountNumberError).toContainText('Must contain at least 9 digits');

        // Account number - valid 9 digits clears error
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('123456789');
        await bankAccountsPage.accountNumberInput.blur();
        await expect(bankAccountsPage.accountNumberError).not.toBeAttached();

        // Account number - valid 12 digits clears error
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('123456789111');
        await bankAccountsPage.accountNumberInput.blur();
        await expect(bankAccountsPage.accountNumberError).not.toBeAttached();

        // Account number - max 12 digits
        await bankAccountsPage.accountNumberInput.clear();
        await bankAccountsPage.accountNumberInput.fill('1234567891111');
        await bankAccountsPage.accountNumberInput.blur();
        await expect(bankAccountsPage.accountNumberError).toBeVisible();
        await expect(bankAccountsPage.accountNumberError).toContainText('Must contain no more than 12 digits');

        await expect(bankAccountsPage.submitButton).toBeDisabled();
    });

    test('soft deletes a bank account', async ({ page, bankAccountsPage }) => {

        await bankAccountsPage.goto();
        await bankAccountsPage.deleteButton.first().click();

        await expect(bankAccountsPage.listItems.first()).toContainText('Deleted');
    });

    test('renders an empty bank account list state with onboarding modal', async ({ bankAccountsPage, onboardingPage, sideNav }) => {
        await bankAccountsPage.interceptEmptyBankAccounts();
        await bankAccountsPage.goto();

        await expect(bankAccountsPage.list).not.toBeAttached();
        await expect(bankAccountsPage.emptyListHeader).toContainText('No Bank Accounts');
        await expect(onboardingPage.dialog).toBeVisible();
        await expect(sideNav.notificationsCount).toBeAttached();
    });

});
