import { test as setup, expect } from '../fixtures';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ request, db, seedDatabase, baseURL, statusValidations}) => {
    const response = await request.post(`/login`, {
        data: {
            username: process.env.TEST_USER,
            password: process.env.TEST_PASS
        }
    })

    await statusValidations.expectStatus(response, statusValidations.OK)
    await request.storageState({ path: authFile });
})