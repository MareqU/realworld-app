import { test } from '../../fixtures';

test.describe('Login API', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('POST /login - Should return valid user and session cookie after login', async ({loginApi, statusValidations, userValidations }) => {
        const response = await loginApi.validLogin();
        await statusValidations.expectStatus(response, statusValidations.OK)
        const body = await response.json();

        await userValidations.assertValidUser(body.user);
        await userValidations.expectLoginCookie(response);
    });

    test('POST /login - should return error when invalid login is provided', async ({ loginApi, statusValidations }) => {
        const response = await loginApi.invalidLogin();

        await statusValidations.expectStatus(response, statusValidations.UNAUTHORIZED)
    })
})