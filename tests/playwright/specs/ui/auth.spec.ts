import { test, expect } from '../../fixtures';
import { SignInPage } from '../../support/pages/SignInPage';
import { SignUpPage } from '../../support/pages/SignUpPage';
import { OnboardingPage } from '../../support/pages/OnboardingPage';
import { SideNavPage } from '../../support/pages/SideNavPage';

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ seedDatabase }) => {
    await seedDatabase();
});

test('should redirect unauthenticated user to signin page', async ({ page }) => {
    await page.goto('/personal');

    await expect(page).toHaveURL(/\/signin/);
});

test('should redirect to the home page after login', async ({ page, db }) => {
    const user = db.find('users', {});
    const signInPage = new SignInPage(page);

    await signInPage.login(user.username, 's3cret');

    await expect(page).toHaveURL('/');
});

test('should remember a user for 30 days after login', async ({ page, context, db }) => {
    const user = db.find('users', {});
    const signInPage = new SignInPage(page);
    const sideNav = new SideNavPage(page);

    await signInPage.goto();
    await signInPage.usernameInput.fill(user.username);
    await signInPage.passwordInput.fill('s3cret');
    await signInPage.rememberMeCheckbox.click();
    await signInPage.submitButton.click();
    await page.waitForURL('/');

    const cookies = await context.cookies('http://localhost:3001');
    const sessionCookie = cookies.find(c => c.name === 'connect.sid');
    expect(sessionCookie?.expires).toBeGreaterThan(0);

    await sideNav.signOut();
    await expect(page).toHaveURL(/\/signin/);
});

test('should allow a visitor to sign-up, login, and logout', async ({ page }) => {
    const userInfo = {
        firstName: 'Bob',
        lastName: 'Ross',
        username: 'PainterJoy90',
        password: 's3cret',
    };

    const signInPage = new SignInPage(page);
    const signUpPage = new SignUpPage(page);
    const onboarding = new OnboardingPage(page);
    const sideNav = new SideNavPage(page);

    // Sign up
    await signInPage.goto();
    await signInPage.signUpLink.click();
    await signInPage.signUpLink.click();

    await expect(page).toHaveURL(/\/signup/);
    await expect(signUpPage.title).toBeVisible();
    await expect(signUpPage.title).toContainText('Sign Up');

    await signUpPage.signUp(userInfo);
    await page.waitForURL(/\/signin/);

    // Login
    await signInPage.login(userInfo.username, userInfo.password);

    // Onboarding
    await expect(onboarding.dialog).toBeVisible();
    await expect(page.getByTestId('list-skeleton')).not.toBeAttached();
    await expect(page.getByTestId('nav-top-notifications-count')).toBeAttached();

    await onboarding.nextButton.click();
    await expect(onboarding.dialogTitle).toContainText('Create Bank Account');

    await onboarding.fillBankAccount('The Best Bank', '123456789', '987654321');
    await onboarding.submitButton.click();

    await expect(onboarding.dialogTitle).toContainText('Finished');
    await expect(onboarding.dialogContent).toContainText("You're all set!");
    await onboarding.nextButton.click();

    await expect(page.getByTestId('transaction-list')).toBeVisible();

    // Logout
    await sideNav.signOut();
    await expect(page).toHaveURL(/\/signin/);
});

test('should display login errors', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await signInPage.usernameInput.fill('User');
    await signInPage.usernameInput.clear();
    await signInPage.usernameInput.blur();
    await expect(page.locator('#username-helper-text')).toBeVisible();
    await expect(page.locator('#username-helper-text')).toContainText('Username is required');

    await signInPage.passwordInput.fill('abc');
    await signInPage.passwordInput.blur();
    await expect(page.locator('#password-helper-text')).toBeVisible();
    await expect(page.locator('#password-helper-text')).toContainText('Password must contain at least 4 characters');

    await expect(signInPage.submitButton).toBeDisabled();
});

test('should display signup errors', async ({ page }) => {
    const signUpPage = new SignUpPage(page);
    await signUpPage.goto();

    await signUpPage.firstNameInput.fill('First');
    await signUpPage.firstNameInput.clear();
    await signUpPage.firstNameInput.blur();
    await expect(page.locator('#firstName-helper-text')).toContainText('First Name is required');

    await signUpPage.lastNameInput.fill('Last');
    await signUpPage.lastNameInput.clear();
    await signUpPage.lastNameInput.blur();
    await expect(page.locator('#lastName-helper-text')).toContainText('Last Name is required');

    await signUpPage.usernameInput.fill('User');
    await signUpPage.usernameInput.clear();
    await signUpPage.usernameInput.blur();
    await expect(page.locator('#username-helper-text')).toContainText('Username is required');

    await signUpPage.passwordInput.fill('password');
    await signUpPage.passwordInput.clear();
    await signUpPage.passwordInput.blur();
    await expect(page.locator('#password-helper-text')).toContainText('Enter your password');

    await signUpPage.confirmPasswordInput.fill('DIFFERENT PASSWORD');
    await signUpPage.confirmPasswordInput.blur();
    await expect(page.locator('#confirmPassword-helper-text')).toContainText('Password does not match');

    await expect(signUpPage.submitButton).toBeDisabled();
});

test('should error for an invalid user', async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.login('invalidUserName', 'invalidPa$$word');

    await expect(signInPage.errorMessage).toBeVisible();
    await expect(signInPage.errorMessage).toHaveText('Username or password is invalid');
});

test('should error for an invalid password for existing user', async ({ page, db }) => {
    const user = db.find('users', {});
    const signInPage = new SignInPage(page);

    await signInPage.login(user.username, 'INVALID');

    await expect(signInPage.errorMessage).toBeVisible();
    await expect(signInPage.errorMessage).toHaveText('Username or password is invalid');
});
