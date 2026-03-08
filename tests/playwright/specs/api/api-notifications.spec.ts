import { test, expect } from '../../fixtures';

test.describe.configure({ mode: 'serial' });

let transactionId: string;
let notificationId: string;
let likeTransactionId: string;
let commentTransactionId: string;

test.beforeAll(async ({ seedDatabase, db }) => {
    await seedDatabase();

    const transaction = db.find('transactions', {});
    transactionId = transaction.id;

    const notification = db.find('notifications', {});
    notificationId = notification.id;

    const like = db.find('likes', {});
    likeTransactionId = like.transactionId;

    const comment = db.find('comments', {});
    commentTransactionId = comment.transactionId;
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

    test('errors when invalid field is sent', async ({ statusValidations, notificationsApi }) => {
        const response = await notificationsApi.updateNotification(notificationId, { notANotificationField: 'not a notification field' });
        await statusValidations.expectStatus(response, statusValidations.INVALID_DATA);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
    });

});
