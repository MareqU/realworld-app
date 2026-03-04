import { test as base } from '@playwright/test';
import { UserApi } from './support/api-objects/UserApi';
import { LoginApi } from './support/api-objects/LoginApi';
import { TransactionsApi } from './support/api-objects/Transactions.Api';
import { UserValidations } from './support/validations/userValidations';
import { StatusValidations } from './support/validations/statusValidations';
import { TransactionValidations } from './support/validations/transactionValidations';
import fs from 'fs';
import path from 'path';

type fixtures = {
    seedDatabase: () => Promise<void>,
    db: {
        find: (entity: string, attrs: object) => any;
        filter: (entity: string, attrs: object) => any[];
    };

    // API objects
    userApi: UserApi;
    loginApi: LoginApi;
    transactionsApi: TransactionsApi

    // Validations
    statusValidations: StatusValidations;
    userValidations: UserValidations;
    transactionValidations: TransactionValidations;

};

export const test = base.extend<fixtures>({
    
    seedDatabase: async ({ request, baseURL }, use) => {

        const seedAction = async () => {
            const response = await request.post(`${baseURL}/testData/seed`);
            if (!response.ok()) throw new Error('Seed failed!');
        };

        await use(seedAction);
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

    // Api objects
    userApi: async({ request }, use) => {
        await use(new UserApi(request));
    },

    loginApi: async({ request }, use) => {
        await use(new LoginApi(request));
    },

    transactionsApi: async({ request }, use) => {
        await use(new TransactionsApi(request));
    },

    // Validations
    statusValidations: async({}, use) => {
        await use(new StatusValidations());
    },

    userValidations: async({}, use) => {
        await use(new UserValidations());
    },

    transactionValidations: async({}, use) => {
        await use(new TransactionValidations());
    },    
})

export { expect } from '@playwright/test'