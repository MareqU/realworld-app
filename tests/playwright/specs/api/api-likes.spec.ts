import { test, expect } from '../../fixtures';

let transactionId: string;

test.beforeAll(async ({ seedDatabase, db }) => {
    await seedDatabase();

    const like = db.find('likes', {});
    transactionId = like.transactionId;
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
