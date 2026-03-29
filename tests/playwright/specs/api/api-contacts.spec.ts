import { test, expect } from '../../fixtures';
import { User, Contact } from '../../../../src/models';
import { createdUserPayload } from '../../support/factories/userFactory';

test.describe.configure({ mode: 'serial' });

let authenticatedUser: User;
let contact: Contact;
let secondContactUserId: string;

test.beforeAll(async ({ currentUser, userApi, contactsApi }) => {
    authenticatedUser = currentUser;

    const userRes = await userApi.postNewUser(createdUserPayload());
    const { user: contactUser } = await userRes.json();

    const contactRes = await contactsApi.createContact(contactUser.id);
    const { contact: createdContact } = await contactRes.json();
    contact = createdContact;

    const userRes2 = await userApi.postNewUser(createdUserPayload());
    const { user: secondUser } = await userRes2.json();
    secondContactUserId = secondUser.id;
});

test.describe('GET /contacts/:username', () => {

    test('gets a list of contacts by username', async ({ statusValidations, contactsApi, contactValidations }) => {
        const response = await contactsApi.getContactsByUsername(authenticatedUser.username);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        contactValidations.validateListOfContacts(body.contacts);
    });

});

test.describe('POST /contacts', () => {

    test('creates a new contact', async ({ statusValidations, contactsApi, contactValidations }) => {
        const response = await contactsApi.createContact(secondContactUserId);
        await statusValidations.expectStatus(response, statusValidations.OK);

        const body = await response.json();
        contactValidations.validateContactSchema(body.contact);
        contactValidations.validateContactBelongsToUser(body.contact, authenticatedUser.id);
    });

    test('errors when invalid contactUserId', async ({ statusValidations, contactsApi }) => {
        const response = await contactsApi.createContact('1234');
        await statusValidations.expectStatus(response, statusValidations.INVALID_DATA);

        const body = await response.json();
        expect(body.errors.length).toBe(1);
    });

});

test.describe('DELETE /contacts/:contactId', () => {

    test('deletes a contact', async ({ statusValidations, contactsApi }) => {
        const response = await contactsApi.deleteContact(contact.id);
        await statusValidations.expectStatus(response, statusValidations.OK);
    });

});
