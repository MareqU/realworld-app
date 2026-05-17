import { test, expect } from '../../fixtures';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';
import { createPaymentPayload } from '../../support/factories/transactionFactory';
import { createdUserPayload } from '../../support/factories/userFactory';

test.describe.configure({ mode: 'serial' });

let transactionId: string;
let notificationId: string;
let likeTransactionId: string;
let commentTransactionId: string;

test.beforeAll(async ({ bankAccountsApi, userApi, transactionsApi, likesApi, commentsApi, notificationsApi }) => {
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
    likeTransactionId = transactionId;

    await commentsApi.createComment(transactionId, 'Initial comment for notification test');
    commentTransactionId = transactionId;

    const notifRes = await notificationsApi.createBulkNotifications([
        { type: 'payment', transactionId, status: 'received' },
    ]);
    const { results } = await notifRes.json();
    notificationId = results[0].id;
});

test.describe('GET /notifications', () => {

    test('gets a list of notifications for a user', async ({ statusValidations, notificationsApi }) => {
        const response = await notificationsApi.getNotifications();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.results.length).toBeGreaterThan(0);
    });

});

test.describe('POST /notifications', () => {

    test('creates notifications for transaction, like and comment', async ({ statusValidations, notificationsApi }) => {
        const response = await notificationsApi.createBulkNotifications([
            { type: 'payment', transactionId, status: 'received' },
            { type: 'like', transactionId, likeId: likeTransactionId },
            { type: 'comment', transactionId, commentId: commentTransactionId },
        ]);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        expect(body.results.length).toBe(3);
        expect(body.results[0].transactionId).toBe(transactionId);
    });

});

test.describe('PATCH /notifications/:notificationId', () => {

    test('updates a notification', async ({ statusValidations, notificationsApi }) => {
        const response = await notificationsApi.updateNotification(notificationId, { isRead: 'true' });
        await statusValidations.expectStatus(response, statusValidations.NO_CONTENT);
    });

    test('errors when invalid field is sent to notification update', async ({ statusValidations, notificationsApi }) => {
        const response = await notificationsApi.updateNotification(notificationId, { notANotificationField: 'not a notification field' });
        await statusValidations.expectStatus(response, statusValidations.INVALID_DATA);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
    });

});
