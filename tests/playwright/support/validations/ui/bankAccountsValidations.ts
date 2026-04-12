import { expect } from '@playwright/test';
import { BankAccountsPage } from '../../pages/BankAccountsPage';

export class BankAccountsValidations {
    private readonly page: BankAccountsPage;

    constructor(page: BankAccountsPage) {
        this.page = page;
    }

    // Bank name errors
    async expectBankNameRequired() {
        await expect(this.page.bankNameError).toBeVisible();
        await expect(this.page.bankNameError).toContainText('Enter a bank name');
    }

    async expectBankNameTooShort() {
        await expect(this.page.bankNameError).toBeVisible();
        await expect(this.page.bankNameError).toContainText('Must contain at least 5 characters');
    }

    // Routing number errors
    async expectRoutingNumberRequired() {
        await expect(this.page.routingNumberError).toBeVisible();
        await expect(this.page.routingNumberError).toContainText('Enter a valid bank routing number');
    }

    async expectRoutingNumberTooShort() {
        await expect(this.page.routingNumberError).toBeVisible();
        await expect(this.page.routingNumberError).toContainText('Must contain a valid routing number');
    }

    async expectRoutingNumberErrorCleared() {
        await expect(this.page.routingNumberError).not.toBeAttached();
    }

    // Account number errors
    async expectAccountNumberRequired() {
        await expect(this.page.accountNumberError).toBeVisible();
        await expect(this.page.accountNumberError).toContainText('Enter a valid bank account number');
    }

    async expectAccountNumberTooShort() {
        await expect(this.page.accountNumberError).toBeVisible();
        await expect(this.page.accountNumberError).toContainText('Must contain at least 9 digits');
    }

    async expectAccountNumberTooLong() {
        await expect(this.page.accountNumberError).toBeVisible();
        await expect(this.page.accountNumberError).toContainText('Must contain no more than 12 digits');
    }

    async expectAccountNumberErrorCleared() {
        await expect(this.page.accountNumberError).not.toBeAttached();
    }

    // Submit button
    async expectSubmitDisabled() {
        await expect(this.page.submitButton).toBeDisabled();
    }

    // List state
    async expectBankAccountCreated(bankName: string, expectedCount: number) {
        await expect(this.page.listItems).toHaveCount(expectedCount);
        await expect(this.page.listItems.filter({ hasText: bankName })).toHaveCount(1);
    }

    async expectBankAccountDeleted() {
        await expect(this.page.listItems.first()).toContainText('Deleted');
    }

    async expectEmptyState() {
        await expect(this.page.list).not.toBeAttached();
        await expect(this.page.emptyListHeader).toContainText('No Bank Accounts');
    }
}
