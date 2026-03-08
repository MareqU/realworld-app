import { expect } from '@playwright/test';

export class BankTransferValidations {

    validateBankTransferSchema(transfer: any) {
        expect(transfer, 'The bank transfer object does not match the RWA schema').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            userId: expect.any(String),
            source: expect.any(String),
            amount: expect.any(Number),
            type: expect.stringMatching(/^(withdrawal|deposit)$/),
            transactionId: expect.any(String),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    validateTransferBelongsToUser(transfer: any, userId: string) {
        expect(
            transfer.userId,
            'Bank transfer should belong to the authenticated user'
        ).toBe(userId);
    }

    validateListOfBankTransfers(transfers: any[]) {
        expect(Array.isArray(transfers), 'Response should be an array').toBe(true);
        transfers.forEach((transfer, index) => {
            try {
                this.validateBankTransferSchema(transfer);
            } catch (error) {
                throw new Error(`Bank transfer at index ${index} failed validation`);
            }
        });
    }
}
