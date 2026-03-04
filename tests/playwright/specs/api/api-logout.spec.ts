import { test } from '../../fixtures';

test.describe('/logout API', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('POST /logout - Should logout the user', async ({ loginApi, userApi, statusValidations }) => {
        await loginApi.validLogin();

        const response = await loginApi.logoutUser();
        await statusValidations.expectStatus(response, statusValidations.OK);
        
        const logoutResponse = await userApi.getAllUsers();
        await statusValidations.expectStatus(logoutResponse, statusValidations.UNAUTHORIZED);
    });
})