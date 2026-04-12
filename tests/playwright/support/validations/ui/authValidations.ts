import { expect } from '@playwright/test';
import { SignInPage } from '../../pages/SignInPage';
import { SignUpPage } from '../../pages/SignUpPage';

export class AuthValidations {
    private readonly signInPage: SignInPage;
    private readonly signUpPage: SignUpPage;

    constructor(signInPage: SignInPage, signUpPage: SignUpPage) {
        this.signInPage = signInPage;
        this.signUpPage = signUpPage;
    }

    // Redirects
    async expectRedirectedToSignIn() {
        await expect(this.signInPage.page).toHaveURL(/\/signin/);
    }

    async expectRedirectedToHome() {
        await expect(this.signInPage.page).toHaveURL('/');
    }

    async expectRedirectedToSignUp() {
        await expect(this.signUpPage.page).toHaveURL(/\/signup/);
    }

    // Sign-up page state
    async expectSignUpPageVisible() {
        await expect(this.signUpPage.title).toBeVisible();
        await expect(this.signUpPage.title).toContainText('Sign Up');
    }

    // Sign-in errors
    async expectUsernameRequired() {
        await expect(this.signInPage.page.locator('#username-helper-text')).toBeVisible();
        await expect(this.signInPage.page.locator('#username-helper-text')).toContainText('Username is required');
    }

    async expectPasswordTooShort() {
        await expect(this.signInPage.page.locator('#password-helper-text')).toBeVisible();
        await expect(this.signInPage.page.locator('#password-helper-text')).toContainText('Password must contain at least 4 characters');
    }

    async expectSignInSubmitDisabled() {
        await expect(this.signInPage.submitButton).toBeDisabled();
    }

    async expectInvalidCredentialsError() {
        await expect(this.signInPage.errorMessage).toBeVisible();
        await expect(this.signInPage.errorMessage).toHaveText('Username or password is invalid');
    }

    // Sign-up errors
    async expectFirstNameRequired() {
        await expect(this.signUpPage.page.locator('#firstName-helper-text')).toContainText('First Name is required');
    }

    async expectLastNameRequired() {
        await expect(this.signUpPage.page.locator('#lastName-helper-text')).toContainText('Last Name is required');
    }

    async expectSignUpUsernameRequired() {
        await expect(this.signUpPage.page.locator('#username-helper-text')).toContainText('Username is required');
    }

    async expectPasswordRequired() {
        await expect(this.signUpPage.page.locator('#password-helper-text')).toContainText('Enter your password');
    }

    async expectPasswordMismatch() {
        await expect(this.signUpPage.page.locator('#confirmPassword-helper-text')).toContainText('Password does not match');
    }

    async expectSignUpSubmitDisabled() {
        await expect(this.signUpPage.submitButton).toBeDisabled();
    }
}
