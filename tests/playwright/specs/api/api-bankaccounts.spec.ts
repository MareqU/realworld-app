import { test } from '../../fixtures';
import { User, BankAccount } from '../../../../src/models';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';

test.describe.configure({ mode: 'serial' });

let authenticatedUser: User;
let bankAccount: BankAccount;

test.beforeAll(async ({ seedDatabase, db }) => {
    await seedDatabase();

    const users = db.filter('users', {});
    authenticatedUser = users[0];

    const accounts = db.filter('bankaccounts', {});
    bankAccount = accounts[0];
});

test.describe('GET /bankAccounts', () => {

    test('gets a list of bank accounts for user', async ({ statusValidations, bankAccountsApi, bankAccountValidations }) => {
        const response = await bankAccountsApi.getBankAccounts();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankAccountValidations.validateListOfBankAccounts(body.results);
        bankAccountValidations.validateAccountBelongsToUser(body.results[0], authenticatedUser.id);
    });

});

test.describe('GET /bankAccounts/:bankAccountId', () => {

    test('gets a bank account', async ({ statusValidations, bankAccountsApi, bankAccountValidations }) => {
        const response = await bankAccountsApi.getBankAccount(bankAccount.id);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankAccountValidations.validateBankAccountSchema(body.account);
        bankAccountValidations.validateAccountBelongsToUser(body.account, authenticatedUser.id);
    });

});

test.describe('POST /bankAccounts', () => {

    test('creates a new bank account', async ({ statusValidations, bankAccountsApi, bankAccountValidations }) => {
        const response = await bankAccountsApi.createBankAccount(createBankAccountPayload());
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankAccountValidations.validateBankAccountSchema(body.account);
        bankAccountValidations.validateAccountBelongsToUser(body.account, authenticatedUser.id);
    });

});

test.describe('DELETE /bankAccounts/:bankAccountId', () => {

    test('deletes a bank account', async ({ statusValidations, bankAccountsApi }) => {
        const response = await bankAccountsApi.deleteBankAccount(bankAccount.id);
        await statusValidations.expectStatus(response, statusValidations.OK);
    });

});

test.describe('GraphQL /graphql', () => {

    test('gets a list of bank accounts for user', async ({ statusValidations, bankAccountsApi, bankAccountValidations }) => {
        const response = await bankAccountsApi.graphqlListBankAccounts();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankAccountValidations.validateAccountBelongsToUser(body.data.listBankAccount[0], authenticatedUser.id);
    });

    test('creates a new bank account', async ({ statusValidations, bankAccountsApi, bankAccountValidations }) => {
        const response = await bankAccountsApi.graphqlCreateBankAccount(createBankAccountPayload());
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankAccountValidations.validateAccountBelongsToUser(body.data.createBankAccount, authenticatedUser.id);
    });

    test('deletes a bank account', async ({ statusValidations, bankAccountsApi }) => {
        const response = await bankAccountsApi.graphqlDeleteBankAccount(bankAccount.id);
        await statusValidations.expectStatus(response, statusValidations.OK);
    });

});
