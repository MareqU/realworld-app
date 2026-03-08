import { test, expect } from '../../fixtures';

test.describe.configure({ mode: 'serial' });

let transactionId: string;

test.beforeAll(async ({ seedDatabase, db }) => {
    await seedDatabase();

    const comment = db.find('comments', {});
    transactionId = comment.transactionId;
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
