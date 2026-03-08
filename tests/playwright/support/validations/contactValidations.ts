import { expect } from '@playwright/test';

export class ContactValidations {

    validateContactSchema(contact: any) {
        expect(contact, 'The contact object does not match the RWA schema').toMatchObject({
            id: expect.any(String),
            uuid: expect.any(String),
            userId: expect.any(String),
            contactUserId: expect.any(String),
            createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
            modifiedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        });
    }

    validateContactBelongsToUser(contact: any, userId: string) {
        expect(
            contact.userId,
            'Contact should belong to the authenticated user'
        ).toBe(userId);
    }

    validateListOfContacts(contacts: any[]) {
        expect(Array.isArray(contacts), 'Response should be an array').toBe(true);
        contacts.forEach((contact, index) => {
            try {
                this.validateContactSchema(contact);
            } catch (error) {
                throw new Error(`Contact at index ${index} failed validation`);
            }
        });
    }
}
