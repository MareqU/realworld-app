import { Page, Locator } from '@playwright/test';

export class SignUpPage {
    readonly page: Page;

    readonly title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('signup-title');
        this.firstNameInput = page.getByTestId('signup-first-name').locator('input');
        this.lastNameInput = page.getByTestId('signup-last-name').locator('input');
        this.usernameInput = page.getByTestId('signup-username').locator('input');
        this.passwordInput = page.getByTestId('signup-password').locator('input');
        this.confirmPasswordInput = page.getByTestId('signup-confirmPassword').locator('input');
        this.submitButton = page.getByTestId('signup-submit');
    }

    async goto() {
        await this.page.goto('/signup');
    }

    async signUp(user: { firstName: string; lastName: string; username: string; password: string }) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
        await this.submitButton.click();
    }
}
