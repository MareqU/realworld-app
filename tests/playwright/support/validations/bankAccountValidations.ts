import { expect } from '@playwright/test';

export class BankAccountValidations {

    validateBankAccountSchema(account: any) {
        expect(account, 'The bank account object does not match the RWA schema').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            userId: expect.any(String),
            bankName: expect.any(String),
            accountNumber: expect.any(String),
            routingNumber: expect.any(String),
            isDeleted: expect.any(Boolean),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    validateAccountBelongsToUser(account: any, userId: string) {
        expect(
            account.userId,
            'Bank account should belong to the authenticated user'
        ).toBe(userId);
    }

    validateListOfBankAccounts(accounts: any[]) {
        expect(Array.isArray(accounts), 'Response should be an array').toBe(true);
        accounts.forEach((account, index) => {
            try {
                this.validateBankAccountSchema(account);
            } catch (error) {
                throw new Error(`Bank account at index ${index} failed validation`);
            }
        });
    }
}
