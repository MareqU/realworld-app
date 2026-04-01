import { Page, Locator } from '@playwright/test';

export class BankAccountsPage {
    readonly page: Page;

    readonly newButton: Locator;
    readonly list: Locator;
    readonly listItems: Locator;
    readonly deleteButton: Locator;

    readonly bankNameInput: Locator;
    readonly routingNumberInput: Locator;
    readonly accountNumberInput: Locator;
    readonly submitButton: Locator;

    readonly emptyListHeader: Locator;

    readonly bankNameError: Locator;
    readonly routingNumberError: Locator;
    readonly accountNumberError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newButton = page.getByTestId('bankaccount-new');
        this.list = page.getByTestId('bankaccount-list');
        this.listItems = page.locator('[data-test^="bankaccount-list-item"]');
        this.deleteButton = page.getByTestId('bankaccount-delete');

        this.bankNameInput = page.getByTestId('bankaccount-bankName-input').locator('input');
        this.routingNumberInput = page.getByTestId('bankaccount-routingNumber-input').locator('input');
        this.accountNumberInput = page.getByTestId('bankaccount-accountNumber-input').locator('input');
        this.submitButton = page.getByTestId('bankaccount-submit');

        this.emptyListHeader = page.getByTestId('empty-list-header');

        this.bankNameError = page.locator('#bankaccount-bankName-input-helper-text');
        this.routingNumberError = page.locator('#bankaccount-routingNumber-input-helper-text');
        this.accountNumberError = page.locator('#bankaccount-accountNumber-input-helper-text');
    }

    async goto() {
        await this.page.goto('/bankaccounts');
    }

    async interceptEmptyBankAccounts() {
        await this.page.route('**/graphql', async (route) => {
            const postData = route.request().postDataJSON();
            if (postData?.operationName === 'ListBankAccount') {
                const response = await route.fetch();
                const json = await response.json();
                json.data.listBankAccount = [];
                await route.fulfill({ response, body: JSON.stringify(json) });
            } else {
                await route.continue();
            }
        });
    }
}
