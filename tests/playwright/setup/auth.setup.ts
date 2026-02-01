import { test as setup, expect } from '../fixtures';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ request, db, seedDatabase, baseURL }) => {
    const users = db.filter('users', {});
    const user = users[0];

    const response = await request.post(`/login`, {
        data: {
            username: process.env.TEST_USER,
            password: process.env.TEST_PASS
        }
    })

    await expect(response, `Failed to login as ${user.username}`).toBeOK();
    await request.storageState({ path: authFile });
})