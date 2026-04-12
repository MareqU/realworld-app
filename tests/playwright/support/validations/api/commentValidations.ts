import { expect } from '@playwright/test';

export class CommentValidations {

    validateCommentSchema(comment: any) {
        expect(comment, 'The comment object does not match the RWA schema').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            content: expect.any(String),
            userId: expect.any(String),
            transactionId: expect.any(String),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    validateListOfComments(comments: any[]) {
        expect(Array.isArray(comments), 'Response should be an array').toBe(true);
        comments.forEach((comment, index) => {
            try {
                this.validateCommentSchema(comment);
            } catch (error) {
                throw new Error(`Comment at index ${index} failed validation`);
            }
        });
    }
}
