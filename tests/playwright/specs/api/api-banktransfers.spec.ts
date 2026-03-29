import { test } from '../../fixtures';
import { User } from '../../../../src/models';
import { createBankAccountPayload } from '../../support/factories/bankAccountFactory';
import { createPaymentPayload } from '../../support/factories/transactionFactory';
import { createdUserPayload } from '../../support/factories/userFactory';

let authenticatedUser: User;

test.beforeAll(async ({ currentUser, bankAccountsApi, userApi, transactionsApi }) => {
    authenticatedUser = currentUser;

    const baRes = await bankAccountsApi.createBankAccount(createBankAccountPayload());
    const { account } = await baRes.json();

    const receiverRes = await userApi.postNewUser(createdUserPayload());
    const { user: receiver } = await receiverRes.json();

    await transactionsApi.createTransaction(createPaymentPayload({
        source: account.id,
        receiverId: receiver.id,
    }));
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
