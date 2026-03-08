import { test } from '../../fixtures';
import { User } from '../../../../src/models';

let authenticatedUser: User;

test.beforeAll(async ({ seedDatabase, db }) => {
    await seedDatabase();

    authenticatedUser = db.find('users', {});
});

test.describe('GET /bankTransfers', () => {

    test('gets a list of bank transfers for user', async ({ statusValidations, bankTransfersApi, bankTransferValidations }) => {
        const response = await bankTransfersApi.getBankTransfers();
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        bankTransferValidations.validateListOfBankTransfers(body.transfers);
        bankTransferValidations.validateTransferBelongsToUser(body.transfers[0], authenticatedUser.id);
    });

});
