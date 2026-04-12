import { APIRequest, APIResponse, expect } from '@playwright/test';

export class TransactionValidations {
    
    async validateTransactionSchema(transactions: any) {

        expect(transactions, 'The transaction object does not match the RWA schema').toMatchObject({
            // Names and Avatars
            receiverName: expect.any(String),
            senderName: expect.any(String),
            receiverAvatar: expect.stringMatching(/^https:\/\/.*\.svg$/),
            senderAvatar: expect.stringMatching(/^https:\/\/.*\.svg$/),

            // Core IDs
            id: expect.any(String),
            uuid: expect.any(String),
            receiverId: expect.any(String),
            senderId: expect.any(String),

            // Financials and Logic
            amount: expect.any(Number),
            description: expect.any(String),
            privacyLevel: expect.stringMatching(/public|private|contacts/),
            status: expect.stringMatching(/complete|pending/),

            // Collections
            likes: expect.any(Array),
            comments: expect.any(Array),

            // Timestamps (ISO 8601)
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });

        if (transactions.requestStatus !== undefined) {
            expect(transactions.requestStatus).toMatch(/pending|accepted|rejected|/);
        }

        if (transactions.requestResolvedAt) {
            expect(transactions.requestResolvedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        }

        if (transactions.likes.length > 0) {
            expect(transactions.likes[0]).toMatchObject({
                id: expect.any(String),
                userId: expect.any(String),
                transactionId: transactions.id, // Logic check: Like must point to this transaction
            });
        }
    }

    validateCreatedTransaction(transaction: any) {
        expect(transaction).toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            amount: expect.any(Number),
            description: expect.any(String),
            receiverId: expect.any(String),
            senderId: expect.any(String),
            privacyLevel: expect.stringMatching(/public|private|contacts/),
            status: expect.stringMatching(/complete|pending/),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    validateSenderOrReceiver(transaction: any, userId: string) {
        expect(
            transaction.senderId === userId || transaction.receiverId === userId,
            'Transaction should belong to the authenticated user'
        ).toBe(true);
    }

    async validateListOfTransactions(body: any[]) {
        expect(Array.isArray(body), 'Response should be an array').toBe(true);
        body.forEach((item, index) => {
            try {
                this.validateTransactionSchema(item);
            } catch (error) {
                throw new Error(`Transaction at index ${index} failed validation: `);
            }
        });
    }
}