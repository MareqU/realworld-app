import { APIRequestContext, APIResponse } from "@playwright/test";

export class ContactsApi {
    private readonly request: APIRequestContext;
    public readonly contacts = '/contacts';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getContactsByUsername(username: string): Promise<APIResponse> {
        return this.request.get(`${this.contacts}/${username}`);
    }

    async createContact(contactUserId: string): Promise<APIResponse> {
        return this.request.post(this.contacts, { data: { contactUserId } });
    }

    async deleteContact(contactId: string): Promise<APIResponse> {
        return this.request.delete(`${this.contacts}/${contactId}`);
    }
}
