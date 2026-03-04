import { test } from '../../fixtures';
import { User } from '../../../../src/models/user';
import { createdUserPayload } from '../../support/factories/userFactory';

    let testUser: User

    test.beforeAll(async ({ seedDatabase, db }) => {
        testUser = await db.find('users', {}); 
    });

    test.describe('GET /users', () => {
        
        test('retrieves a paginated list of all users', async ({ request, userApi, statusValidations, userValidations }) => {  
            const response = await userApi.getAllUsers(); 
            await statusValidations.expectStatus(response, statusValidations.OK)
            const body = await response.json();
            
            const user = body.results[0];
            userValidations.assertValidUser(user);
        });

        test('retrieves a single user by their unique id', async ({ userApi, statusValidations, userValidations }) => {
            const response = await userApi.getUserById(testUser.id);
            await statusValidations.expectStatus(response, statusValidations.OK)
            const body = await response.json();

            userValidations.assertValidUser(body.user);
        });
        
        test('returns 404 Not Found when the user ID does not exist', async ({ userApi, statusValidations }) => {
            const nonExistentId = '0000000';

            const response = await userApi.getUserById(nonExistentId);
            await statusValidations.expectStatus(response, statusValidations.UNAUTHORIZED)

            statusValidations.expectError(response);
        });

        test('fetches public profile data via username handle', async ({ userApi, statusValidations, userValidations }) => {        
            const response = await userApi.getUserProfileByUserName(testUser.username);
            await statusValidations.expectStatus(response, statusValidations.OK)
            const body = await response.json();

            userValidations.assertUserProfile(body.user);
        });

        test('filters user list by exact email match', async ({ userApi, statusValidations }) => {
            const response = await userApi.getUserByEmail(testUser.email);

            await statusValidations.expectStatus(response, statusValidations.OK)
        });

        test('filters user list by exact phone number match', async ({ userApi, statusValidations }) => {
            const response = await userApi.getUserByEmail(testUser.phoneNumber);

            await statusValidations.expectStatus(response, statusValidations.OK)
        });

        test('filters user list by exact username', async ({ userApi, statusValidations }) => {
            const response = await userApi.getUserByEmail(testUser.username);

            await statusValidations.expectStatus(response, statusValidations.OK)
        });
    }); 
    
    test.describe('POST /users', () => {

        test('registers a new user with valid credentials', async ({ userApi, statusValidations, userValidations }) => {
            const userData = createdUserPayload();

            const response = await userApi.postNewUser(userData);
            await statusValidations.expectStatus(response, statusValidations.CREATED);
            const body = await response.json();

            userValidations.assertCreatedUser(body.user, userData);
        });

        test('initializes a new account with a specific starting balance', async ({ userApi, statusValidations, userValidations }) => {
            const userData = createdUserPayload({balance: 100_00});

            const response = await userApi.postNewUser(userData);
            const body = await response.json();

            await statusValidations.expectStatus(response, statusValidations.CREATED);
            userValidations.assertCreatedUser(body.user, userData);
        });
    });

    test.describe('PATCH /users', () => {

        test('partially updates user profile fields (firstName)', async ({ userApi, statusValidations }) => {
            const firstName = {
                firstName: "Test"
            };

            const response = await userApi.patchUser(testUser.id, firstName);

            await statusValidations.expectStatus(response, statusValidations.NO_CONTENT);
        });

        test('rejects update requests containing schema-violating fields', async ({ userApi, statusValidations }) => {
            const userData = {
                notAUserField: "not a user field"
            };

            const response = await userApi.patchUser(testUser.id, userData);

            await statusValidations.expectStatus(response, statusValidations.INVALID_DATA);
            await statusValidations.expectError(response);
        });
    });
