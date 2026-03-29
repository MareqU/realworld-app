import { test, expect } from '../../fixtures';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';
import { createPaymentPayload } from '../../support/factories/transactionFactory';
import { createdUserPayload } from '../../support/factories/userFactory';

let transactionId: string;

test.beforeAll(async ({ bankAccountsApi, userApi, transactionsApi, likesApi }) => {
    const baRes = await bankAccountsApi.createBankAccount(createBankAccountPayload());
    const { account } = await baRes.json();

    const receiverRes = await userApi.postNewUser(createdUserPayload());
    const { user: receiver } = await receiverRes.json();

    const txRes = await transactionsApi.createTransaction(createPaymentPayload({
        source: account.id,
        receiverId: receiver.id,
    }));
    const { transaction } = await txRes.json();
    transactionId = transaction.id;

    await likesApi.createLike(transactionId);
});

test.describe('GET /likes/:transactionId', () => {

    test('gets a list of likes for a transaction', async ({ statusValidations, likesApi }) => {
        const response = await likesApi.getLikesForTransaction(transactionId);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.likes.length).toBe(1);
    });

});

test.describe('POST /likes/:transactionId', () => {

    test('creates a new like for a transaction', async ({ statusValidations, likesApi }) => {
        const response = await likesApi.createLike(transactionId);
        await statusValidations.expectStatus(response, statusValidations.OK);
    });

});
