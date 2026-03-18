import { Page, Locator } from '@playwright/test';

export class SignInPage {
    readonly page: Page;

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly submitButton: Locator;
    readonly signUpLink: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('signin-username').locator('input');
        this.passwordInput = page.getByTestId('signin-password').locator('input');
        this.rememberMeCheckbox = page.getByTestId('signin-remember-me');
        this.submitButton = page.getByTestId('signin-submit');
        this.signUpLink = page.getByTestId('signup');
        this.errorMessage = page.getByTestId('signin-error');
    }

    async goto() {
        await this.page.goto('/signin');
    }

    async login(username: string, password: string) {
        await this.goto();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
