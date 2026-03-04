import { test as setup, expect } from '../fixtures';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ request, db, seedDatabase, baseURL, statusValidations}) => {
    const response = await request.post(`/login`, {
        // Only temporary solution, it would be taken from .env
        data: {
            username: 'Heath93',
            password: 's3cret'
        }
    })

    await statusValidations.expectStatus(response, statusValidations.OK)
    await request.storageState({ path: authFile });
})