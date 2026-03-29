import { test, expect } from '../../fixtures';
import { User } from '../../../../src/models/user';
import { createPaymentPayload, createRequestPayload } from '../../support/factories/transactionFactory';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';
import { createdUserPayload } from '../../support/factories/userFactory';

let testUser: User;
let receiver: User;
let bankAccountId: string;
let transactionId: string;

test.beforeAll(async ({ currentUser, userApi, bankAccountsApi, transactionsApi }) => {
    testUser = currentUser;

    const receiverRes = await userApi.postNewUser(createdUserPayload());
    const { user } = await receiverRes.json();
    receiver = user;

    const baRes = await bankAccountsApi.createBankAccount(createBankAccountPayload());
    const { account } = await baRes.json();
    bankAccountId = account.id;

    const txRes = await transactionsApi.createTransaction(createRequestPayload({
        source: bankAccountId,
        receiverId: receiver.id,
    }));
    const { transaction } = await txRes.json();
    transactionId = transaction.id;
});

test.describe('GET /transactions', () => {

    test('gets a list of transactions for user', async({ statusValidations, transactionsApi, transactionValidations }) => {
        const response = await transactionsApi.getAllTransactions();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        const transactions = body.results;

        transactionValidations.validateSenderOrReceiver(transactions[0], testUser.id);
        await transactionValidations.validateListOfTransactions(transactions);
    });

    test('gets a list of pending request transactions for user', async({ statusValidations, transactionsApi, transactionValidations }) => {
        const response = await transactionsApi.getAllTransactions({
            requestStatus: 'pending'
        });
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        const transactions = body.results;

        transactionValidations.validateSenderOrReceiver(transactions[0], testUser.id);
        await transactionValidations.validateListOfTransactions(transactions);
    });

    test('gets a list of pending request transactions for user between a time range', async({ statusValidations, transactionsApi, transactionValidations }) => {
        const response = await transactionsApi.getAllTransactions({
            requestStatus: 'pending',
            dateRangeStart: new Date("Jan 01 2018").toISOString(),
            dateRangeEnd: new Date("Dec 05 2030").toISOString(),
        });
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        const transactions = body.results;

        transactionValidations.validateSenderOrReceiver(transactions[0], testUser.id);
        await transactionValidations.validateListOfTransactions(transactions);
    });

})

test.describe('GET /transactions/contacts', () => {

    test('gets a list of transactions for users list of contacts, page one', async ({ statusValidations, transactionsApi }) => {
        const response = await transactionsApi.getContactTransactions();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.results.length).toBeGreaterThan(1);
    });

    test('gets a list of transactions for users list of contacts, page two', async ({ statusValidations, transactionsApi }) => {
        const response = await transactionsApi.getContactTransactions({ page: 2 });
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.results.length).toBeGreaterThan(1);
    });

})

test.describe('GET /transactions/public', () => {

    test('gets a list of public transactions', async ({ statusValidations, transactionsApi }) => {
        const response = await transactionsApi.getPublicTransactions();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.results.length).toBeGreaterThan(1);
    });

})

test.describe('POST /transactions', () => {

    test('creates a new payment', async ({ statusValidations, transactionsApi, transactionValidations }) => {
        const response = await transactionsApi.createTransaction(
            createPaymentPayload({ source: bankAccountId, receiverId: receiver.id })
        );
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        transactionValidations.validateCreatedTransaction(body.transaction);
        expect(body.transaction.status).toBe('complete');
        expect(body.transaction.requestStatus).toBeUndefined();
    });

    test('creates a new request', async ({ statusValidations, transactionsApi, transactionValidations }) => {
        const response = await transactionsApi.createTransaction(
            createRequestPayload({ source: bankAccountId, receiverId: receiver.id })
        );
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        transactionValidations.validateCreatedTransaction(body.transaction);
        expect(body.transaction.status).toBe('pending');
        expect(body.transaction.requestStatus).toBe('pending');
    });

})

test.describe('PATCH /transactions/:transactionId', () => {

    test('updates a transaction', async ({ statusValidations, transactionsApi }) => {
        const response = await transactionsApi.updateTransaction(transactionId, { requestStatus: 'rejected' });
        await statusValidations.expectStatus(response, statusValidations.NO_CONTENT);
    });

    test('errors when an invalid field is sent', async ({ statusValidations, transactionsApi }) => {
        const response = await transactionsApi.updateTransaction(transactionId, { notATransactionField: 'not a transaction field' });
        await statusValidations.expectStatus(response, statusValidations.INVALID_DATA);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
    });

})