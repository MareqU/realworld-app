import { test, expect } from '../../fixtures';
import { assertValidUser, assertUserProfile } from '../../support/assertions/userAssertions';
import { User } from '../../../../src/models/user';

test.describe('Users API', () => {
    
    test('GET /users - should return a list of users', async ({ request, seedDatabase, userApi }) => {  
        const response = await userApi.getAllUsers(); 
        const body = await response.json();
        const user = body.results[0];

        expect(response.status()).toBe(200);
        assertValidUser(user);
    })

    test('GET /users/:id - should return specific user by id', async ({ userApi, db, seedDatabase }) => {
        const userInDb = await db.find('users', {});

        const response = await userApi.getUserById(userInDb.id);
        const body = await response.json();

        expect(response.status()).toBe(200);
        assertValidUser(body.user);
    });
    
    test('GET /users/:id - returns error when non-existent id provided', async ({ userApi }) => {
        const nonExistentId = '0000000';

        const response = await userApi.getUserById(nonExistentId);
        const body = await response.json();

        expect(response.status()).toBe(401);
        expect(body).toMatchObject({
            error: expect.any(String) 
        });
    });

    test('GET /users/profile/:username - should return user profile by username', async ({ userApi, db, seedDatabase }) => {
        const userInDb = await db.find('users', {});
        
        const response = await userApi.getUserProfileByUserName(userInDb.username);
        const body = await response.json();

        expect(response.status()).toBe(200);
        assertUserProfile(body.user);
    })

    test('GET /users/search by email', async ({ userApi, db, seedDatabase }) => {
        const usersInDb = await db.find('users', {});
        
    })
})