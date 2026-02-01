import { test as base } from '@playwright/test';
import { UserApi } from './support/api-objects/UserApi';
import fs from 'fs';
import path from 'path';

type fixtures = {
    seedDatabase: void,
    db: {
        find: (entity: string, attrs: object) => any;
        filter: (entity: string, attrs: object) => any[];
    };
    // API objects
    userApi: UserApi;
};

export const test = base.extend<fixtures>({
    
    userApi: async({ request }, use) => {
        await use(new UserApi(request))
    },

    seedDatabase: async ({ request, baseURL }, use) => {

        console.log('Seeding database via API at baseURL:', baseURL);

        await request.post(`/testData/seed`);
        await use();
    },

    db: async({}, use) => {

        const DB_PATH = path.resolve(__dirname, '../../data/database.json');
        const getDbData = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

        const dbUtils = {
            filter: (entity: string, attrs: object) => {
                const data = getDbData();
                const items = data[entity] || [];
                return items.filter((item: any) => 
                    Object.entries(attrs).every(([key, value]) => item[key] === value)
                )
            },
            find: (entity: string, attrs: object) => {
                const data = getDbData();
                const items = data[entity] || [];
                return items.find((item: any) => 
                    Object.entries(attrs).every(([key, value]) => item[key] === value)
                )
            }
        }

        await use(dbUtils);
    },
})

export { expect } from '@playwright/test'