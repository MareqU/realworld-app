import { test, expect } from '../../fixtures';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';
import { createPaymentPayload } from '../../support/factories/transactionFactory';
import { createdUserPayload } from '../../support/factories/userFactory';

test.describe.configure({ mode: 'serial' });

let transactionId: string;

test.beforeAll(async ({ bankAccountsApi, userApi, transactionsApi, commentsApi }) => {
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

    await commentsApi.createComment(transactionId, 'Initial comment for test');
});

test.describe('GET /comments/:transactionId', () => {

    test('gets a list of comments for a transaction', async ({ statusValidations, commentsApi, commentValidations }) => {
        const response = await commentsApi.getCommentsForTransaction(transactionId);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.comments.length).toBe(1);
        commentValidations.validateListOfComments(body.comments);
    });

});

test.describe('POST /comments/:transactionId', () => {

    test('creates a new comment for a transaction', async ({ statusValidations, commentsApi, commentValidations }) => {
        const response = await commentsApi.createComment(transactionId, 'This is my comment');
        await statusValidations.expectStatus(response, statusValidations.OK);
    });
});
