import { Page, Locator } from '@playwright/test';

export class OnboardingPage {
    readonly page: Page;

    readonly dialog: Locator;
    readonly dialogTitle: Locator;
    readonly dialogContent: Locator;
    readonly nextButton: Locator;
    readonly bankNameInput: Locator;
    readonly accountNumberInput: Locator;
    readonly routingNumberInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.getByTestId('user-onboarding-dialog');
        this.dialogTitle = page.getByTestId('user-onboarding-dialog-title');
        this.dialogContent = page.getByTestId('user-onboarding-dialog-content');
        this.nextButton = page.getByTestId('user-onboarding-next');
        this.bankNameInput = page.getByTestId('bankaccount-bankName-input').locator('input');
        this.accountNumberInput = page.getByTestId('bankaccount-accountNumber-input').locator('input');
        this.routingNumberInput = page.getByTestId('bankaccount-routingNumber-input').locator('input');
        this.submitButton = page.getByTestId('bankaccount-submit');
    }

    async fillBankAccount(bankName: string, accountNumber: string, routingNumber: string) {
        await this.bankNameInput.fill(bankName);
        await this.accountNumberInput.fill(accountNumber);
        await this.routingNumberInput.fill(routingNumber);
    }
}
