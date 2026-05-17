import { test, expect } from '../../fixtures';

test.describe('New Transaction', () => {

    test.beforeEach(async ({ seedDatabase, signInPage, page }) => {
        await seedDatabase();
        await signInPage.login(process.env.TEST_USER, process.env.TEST_PASS);
        await page.waitForURL('/');
    });

    // Qase: Send a payment to another user | Suite: UI/Transactions
    test('Send a payment to another user', async ({ page, newTransactionPage }) => {
        await newTransactionPage.goto();
        await expect(newTransactionPage.usersList).toBeVisible();

        await newTransactionPage.selectFirstContact();
        await expect(newTransactionPage.amountInput).toBeVisible();

        await newTransactionPage.amountInput.fill('50');
        await newTransactionPage.descriptionInput.fill('Dinner split');
        await newTransactionPage.payButton.click();

        await expect(newTransactionPage.returnToTransactionsButton).toBeVisible();

        await newTransactionPage.returnToTransactionsButton.click();
        await expect(page).toHaveURL('/');
    });

    // Qase: Request money from another user | Suite: UI/Transactions
    test('Request money from another user', async ({ page, newTransactionPage }) => {
        await newTransactionPage.goto();
        await expect(newTransactionPage.usersList).toBeVisible();

        await newTransactionPage.selectFirstContact();
        await expect(newTransactionPage.amountInput).toBeVisible();

        await newTransactionPage.amountInput.fill('25');
        await newTransactionPage.descriptionInput.fill('Rent share');
        await newTransactionPage.requestButton.click();

        await expect(newTransactionPage.returnToTransactionsButton).toBeVisible();
    });

    // Qase: Search for a contact by partial name in the new transaction wizard | Suite: UI/Transactions
    test('Search for a contact by partial name in the new transaction wizard', async ({ newTransactionPage }) => {
        await newTransactionPage.goto();
        await expect(newTransactionPage.usersList).toBeVisible();

        const initialCount = await newTransactionPage.usersList.locator('[data-test^="user-list-item"]').count();

        await newTransactionPage.searchContact('Ted');
        const filteredCount = await newTransactionPage.usersList.locator('[data-test^="user-list-item"]').count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);

        await newTransactionPage.searchInput.clear();
        await expect(newTransactionPage.usersList.locator('[data-test^="user-list-item"]').first()).toBeVisible();
    });

    // Qase: Search for a non-existent contact returns empty results in new transaction wizard | Suite: UI/Transactions
    test('Search for a non-existent contact returns empty results in new transaction wizard', async ({ newTransactionPage }) => {
        await newTransactionPage.goto();
        await expect(newTransactionPage.usersList).toBeVisible();

        await newTransactionPage.searchContact('xyznonexistent');
        await expect(newTransactionPage.usersList.locator('[data-test^="user-list-item"]')).toHaveCount(0);

        await newTransactionPage.searchInput.fill('');
    });

    // Qase: Verify Pay and Request buttons are disabled until amount is entered | Suite: UI/Transactions
    test('Verify Pay and Request buttons are disabled until amount is entered', async ({ newTransactionPage }) => {
        await newTransactionPage.goto();
        await newTransactionPage.selectFirstContact();

        await expect(newTransactionPage.payButton).toBeDisabled();
        await expect(newTransactionPage.requestButton).toBeDisabled();

        await newTransactionPage.descriptionInput.fill('Test note');
        await newTransactionPage.amountInput.pressSequentially('10');
        await expect(newTransactionPage.payButton).toBeEnabled();
        await expect(newTransactionPage.requestButton).toBeEnabled();

        await newTransactionPage.amountInput.press('Control+a');
        await newTransactionPage.amountInput.press('Delete');
        await expect(newTransactionPage.payButton).toBeDisabled();
        await expect(newTransactionPage.requestButton).toBeDisabled();
    });

    // Qase: Enter invalid negative amount in new transaction payment form | Suite: UI/Transactions
    test('Enter invalid negative amount in new transaction payment form', async ({ newTransactionPage }) => {
        await newTransactionPage.goto();
        await newTransactionPage.selectFirstContact();

        await newTransactionPage.amountInput.fill('-50');
        await expect(newTransactionPage.payButton).toBeDisabled();
        await expect(newTransactionPage.requestButton).toBeDisabled();

        await newTransactionPage.amountInput.clear();
        await newTransactionPage.amountInput.fill('0');
        await expect(newTransactionPage.payButton).toBeDisabled();
        await expect(newTransactionPage.requestButton).toBeDisabled();
    });

});
