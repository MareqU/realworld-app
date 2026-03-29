import { test as base } from '@playwright/test';
import { UserApi } from './support/api-objects/UserApi';
import { LoginApi } from './support/api-objects/LoginApi';
import { TransactionsApi } from './support/api-objects/Transactions.Api';
import { NotificationsApi } from './support/api-objects/NotificationsApi';
import { LikesApi } from './support/api-objects/LikesApi';
import { ContactsApi } from './support/api-objects/ContactsApi';
import { CommentsApi } from './support/api-objects/CommentsApi';
import { BankTransfersApi } from './support/api-objects/BankTransfersApi';
import { BankAccountsApi } from './support/api-objects/BankAccountsApi';
import { UserValidations } from './support/validations/userValidations';
import { StatusValidations } from './support/validations/statusValidations';
import { TransactionValidations } from './support/validations/transactionValidations';
import { ContactValidations } from './support/validations/contactValidations';
import { CommentValidations } from './support/validations/commentValidations';
import { BankTransferValidations } from './support/validations/bankTransferValidations';
import { BankAccountValidations } from './support/validations/bankAccountValidations';
import fs from 'fs';
import path from 'path';

type fixtures = {
    seedDatabase: () => Promise<void>,
    currentUser: any,
    db: {
        find: (entity: string, attrs: object) => any;
        filter: (entity: string, attrs: object) => any[];
    };

    // API objects
    userApi: UserApi;
    loginApi: LoginApi;
    transactionsApi: TransactionsApi;
    notificationsApi: NotificationsApi;
    likesApi: LikesApi;
    contactsApi: ContactsApi;
    commentsApi: CommentsApi;
    bankTransfersApi: BankTransfersApi;
    bankAccountsApi: BankAccountsApi;

    // POM
    

    // Validations
    statusValidations: StatusValidations;
    userValidations: UserValidations;
    transactionValidations: TransactionValidations;
    contactValidations: ContactValidations;
    commentValidations: CommentValidations;
    bankTransferValidations: BankTransferValidations;
    bankAccountValidations: BankAccountValidations;

};

export const test = base.extend<fixtures>({
    
    seedDatabase: async ({ request }, use) => {

        const backendUrl = process.env.VITE_BACKEND_PORT
            ? `http://localhost:${process.env.VITE_BACKEND_PORT}`
            : 'http://localhost:3001';

        const seedAction = async () => {
            const response = await request.post(`${backendUrl}/testData/seed`);
            if (!response.ok()) throw new Error('Seed failed!');
        };

        await use(seedAction);
    },

    currentUser: async ({}, use: (user: any) => Promise<void>) => {
        const userDataFile = path.join(__dirname, '.auth/userData.json');
        const user = JSON.parse(fs.readFileSync(userDataFile, 'utf-8'));
        await use(user);
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

    notificationsApi: async({ request }, use) => {
        await use(new NotificationsApi(request));
    },

    likesApi: async({ request }, use) => {
        await use(new LikesApi(request));
    },

    contactsApi: async({ request }, use) => {
        await use(new ContactsApi(request));
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

    contactValidations: async({}, use) => {
        await use(new ContactValidations());
    },

    commentsApi: async({ request }, use) => {
        await use(new CommentsApi(request));
    },

    commentValidations: async({}, use) => {
        await use(new CommentValidations());
    },

    bankTransfersApi: async({ request }, use) => {
        await use(new BankTransfersApi(request));
    },

    bankTransferValidations: async({}, use) => {
        await use(new BankTransferValidations());
    },

    bankAccountsApi: async({ request }, use) => {
        await use(new BankAccountsApi(request));
    },

    bankAccountValidations: async({}, use) => {
        await use(new BankAccountValidations());
    },
})

export { expect } from '@playwright/test'