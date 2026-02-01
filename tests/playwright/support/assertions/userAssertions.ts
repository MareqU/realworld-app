import { expect } from '@playwright/test';
import { User } from '../../../../src/models/user';
import { number } from 'yup';

export const assertValidUser = (user: User, expectedUsername?: string) => {
    // Check all fields when user is returned by id or in user list
    expect(user, 'User object should match schema').toMatchObject({
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
    })

    if (expectedUsername) {
        expect(user.username).toBe(expectedUsername);
    }
}

export const assertUserProfile = (profile: Partial<User>, expectedValues?: Partial<User>) => {
    // Ensure sensitive fields are not present in the profile response
    expect(profile, 'Profile should not contains sensitive fields').not.toHaveProperty('password');
    expect(profile, 'Profile should not contains sensitive fields').not.toHaveProperty('balance');

    expect(profile, 'Profile object should match public schema').toMatchObject({
        firstName: expect.any(String),
        lastName: expect.any(String),
        avatar: expect.stringContaining('https')
    })
}

