// support/assertions/UserAssertions.ts
import { APIRequest, APIResponse, expect } from '@playwright/test';
import { User } from '../../../../../src/models/user';
import { head } from 'lodash';

export class UserValidations {

    /**
     * Specific assertion for the POST /users response.
     * Only validates fields returned immediately upon creation.
     */
    assertCreatedUser(user: Partial<User>, expectedData: Partial<User>) {
        expect(user, 'Created user should match the sent payload').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            username: expect.any(String),
            email: expect.stringMatching(/@/),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    /**
     * Full assertion for GET /users/:id or list responses.
     * Validates the complete schema including database defaults.
     */
    assertValidUser(user: User) {
        expect(user, 'Full user object should match complete schema').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            username: expect.any(String),
            password: expect.stringMatching(/^\$2[ayb]\$\d{2}\$[./0-9A-Za-z]{53}$/),
            email: expect.stringMatching(/@/),
            phoneNumber: expect.stringMatching(/\d+/),
            avatar: expect.stringContaining('https'),
            defaultPrivacyLevel: expect.any(String),
            balance: expect.any(Number),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
        });
    }

    // Assertion for /profile/:username
    assertUserProfile(profile: Partial<User>) {
        expect(profile, 'Profile should not contain sensitive fields').not.toHaveProperty('password');
        expect(profile, 'Profile object should match public schema').toMatchObject({
            firstName: expect.any(String),
            lastName: expect.any(String),
            avatar: expect.stringContaining('https')
        });
    }

    expectLoginCookie(response: APIResponse) {
        const headers = response.headers();
        const setCookie = headers['set-cookie'];

        expect(setCookie, 'Response must contain set-cookie header').toBeDefined();
        expect(setCookie, 'Should contain connect.sid session cookie').toContain('connect.sid');
        expect(setCookie).toContain('HttpOnly'); 
        expect(setCookie).toContain('Path=/');
    }
}