import { Page, Locator } from '@playwright/test';

export class NewTransactionPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly usersList: Locator;
    readonly amountInput: Locator;
    readonly descriptionInput: Locator;
    readonly payButton: Locator;
    readonly requestButton: Locator;
    readonly returnToTransactionsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByTestId('user-list-search-input');
        this.usersList = page.getByTestId('users-list');
        this.amountInput = page.getByTestId('transaction-create-amount-input').locator('input');
        this.descriptionInput = page.getByTestId('transaction-create-description-input').locator('input');
        this.payButton = page.getByTestId('transaction-create-submit-payment');
        this.requestButton = page.getByTestId('transaction-create-submit-request');
        this.returnToTransactionsButton = page.getByTestId('new-transaction-return-to-transactions');
    }

    async goto() {
        await this.page.goto('/transaction/new');
    }

    async searchContact(name: string) {
        await this.searchInput.fill(name);
    }

    async selectFirstContact() {
        await this.usersList.locator('[data-test^="user-list-item"]').first().click();
    }
}
