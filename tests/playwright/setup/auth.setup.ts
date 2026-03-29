import { test as setup } from '../fixtures';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');
const userDataFile = path.join(__dirname, '../.auth/userData.json');

setup('authenticate', async ({ request, statusValidations }) => {
    const response = await request.post(`/login`, {
        data: {
            username: process.env.TEST_USER,
            password: process.env.TEST_PASS
        }
    });

    await statusValidations.expectStatus(response, statusValidations.OK);
    const body = await response.json();
    fs.writeFileSync(userDataFile, JSON.stringify(body.user));
    await request.storageState({ path: authFile });
})