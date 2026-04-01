import { test, expect } from '../../fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ seedDatabase }) => {
    await seedDatabase();
});

test.describe('Authorization', () => {

    test('should redirect unauthenticated user to signin page', async ({ page }) => {
        await page.goto('/personal');

        await expect(page).toHaveURL(/\/signin/);
    });

    test('should redirect to the home page after login', async ({ page, db, signInPage }) => {
        const user = db.find('users', {});

        await signInPage.login(user.username, process.env.TEST_PASS);

        await expect(page).toHaveURL('/');
    });

    test('should remember a user for 30 days after login', async ({ page, context, db, signInPage, sideNav }) => {
        const user = db.find('users', {});

        await signInPage.goto();
        await signInPage.usernameInput.fill(user.username);
        await signInPage.passwordInput.fill(process.env.TEST_PASS!);
        await signInPage.rememberMeCheckbox.click();
        await signInPage.submitButton.click();
        await page.waitForURL('/');

        const cookies = await context.cookies(process.env.VITE_BACKEND_PORT);
        const sessionCookie = cookies.find(c => c.name === 'connect.sid');
        expect(sessionCookie?.expires).toBeGreaterThan(0);

        await sideNav.signOut();
        await expect(page).toHaveURL(/\/signin/);
    });

    test('should allow a visitor to sign-up, login, and logout', async ({ page, signInPage, signUpPage, onboardingPage, sideNav }) => {
        const userInfo = {
            firstName: 'Bob',
            lastName: 'Ross',
            username: 'PainterJoy90',
            password: 's3cret',
        };

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
        await expect(onboardingPage.dialog).toBeVisible();
        await expect(page.getByTestId('list-skeleton')).not.toBeAttached();
        await expect(page.getByTestId('nav-top-notifications-count')).toBeAttached();

        await onboardingPage.nextButton.click();
        await expect(onboardingPage.dialogTitle).toContainText('Create Bank Account');

        await onboardingPage.fillBankAccount('The Best Bank', '123456789', '987654321');
        await onboardingPage.submitButton.click();

        await expect(onboardingPage.dialogTitle).toContainText('Finished');
        await expect(onboardingPage.dialogContent).toContainText("You're all set!");
        await onboardingPage.nextButton.click();

        await expect(page.getByTestId('transaction-list')).toBeVisible();

        // Logout
        await sideNav.signOut();
        await expect(page).toHaveURL(/\/signin/);
    });

    test('should display login errors', async ({ signInPage }) => {
        await signInPage.goto();

        await signInPage.usernameInput.fill('User');
        await signInPage.usernameInput.clear();
        await signInPage.usernameInput.blur();
        await expect(signInPage.page.locator('#username-helper-text')).toBeVisible();
        await expect(signInPage.page.locator('#username-helper-text')).toContainText('Username is required');

        await signInPage.passwordInput.fill('abc');
        await signInPage.passwordInput.blur();
        await expect(signInPage.page.locator('#password-helper-text')).toBeVisible();
        await expect(signInPage.page.locator('#password-helper-text')).toContainText('Password must contain at least 4 characters');

        await expect(signInPage.submitButton).toBeDisabled();
    });

    test('should display signup errors', async ({ signUpPage }) => {
        await signUpPage.goto();

        await signUpPage.firstNameInput.fill('First');
        await signUpPage.firstNameInput.clear();
        await signUpPage.firstNameInput.blur();
        await expect(signUpPage.page.locator('#firstName-helper-text')).toContainText('First Name is required');

        await signUpPage.lastNameInput.fill('Last');
        await signUpPage.lastNameInput.clear();
        await signUpPage.lastNameInput.blur();
        await expect(signUpPage.page.locator('#lastName-helper-text')).toContainText('Last Name is required');

        await signUpPage.usernameInput.fill('User');
        await signUpPage.usernameInput.clear();
        await signUpPage.usernameInput.blur();
        await expect(signUpPage.page.locator('#username-helper-text')).toContainText('Username is required');

        await signUpPage.passwordInput.fill('password');
        await signUpPage.passwordInput.clear();
        await signUpPage.passwordInput.blur();
        await expect(signUpPage.page.locator('#password-helper-text')).toContainText('Enter your password');

        await signUpPage.confirmPasswordInput.fill('DIFFERENT PASSWORD');
        await signUpPage.confirmPasswordInput.blur();
        await expect(signUpPage.page.locator('#confirmPassword-helper-text')).toContainText('Password does not match');

        await expect(signUpPage.submitButton).toBeDisabled();
    });

    test('should error for an invalid user', async ({ signInPage }) => {
        await signInPage.login('invalidUserName', 'invalidPa$$word');

        await expect(signInPage.errorMessage).toBeVisible();
        await expect(signInPage.errorMessage).toHaveText('Username or password is invalid');
    });

    test('should error for an invalid password for existing user', async ({ db, signInPage }) => {
        const user = db.find('users', {});

        await signInPage.login(user.username, 'INVALID');

        await expect(signInPage.errorMessage).toBeVisible();
        await expect(signInPage.errorMessage).toHaveText('Username or password is invalid');
    });
})