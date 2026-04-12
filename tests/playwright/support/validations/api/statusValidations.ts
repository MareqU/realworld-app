import { expect, APIResponse } from '@playwright/test'

export class StatusValidations {
    public readonly OK = 200;
    public readonly UNAUTHORIZED = 401; 
    public readonly CREATED = 201;
    public readonly INVALID_DATA = 422;
    public readonly NO_CONTENT = 204;

    async expectOk(response: APIResponse, customMessage?: string) {
        const body = await response.text();
        const message = customMessage || `Expected status 200 but got ${response.status()}`

        expect(
            response.status(),
            `${message}\nResponse Body: ${body}`
        ).toBe(this.OK);
    }

    async expectStatus(response: APIResponse, expectedStatus: number) {
        const body = await response.text();
        expect(
            response.status(),
            `Expected ${expectedStatus} but got ${response.status()}\nBody: ${body}`
        ).toBe(expectedStatus);
    }

    async expectError(response : APIResponse, expectedMessage?: string | RegExp) {
        const body = await response.json();
        const errorMessage = body.error || (body.errors ? JSON.stringify(body.errors) : null);

        expect(errorMessage, `Response body should contain an error message`).not.toBeNull();

        if (expectedMessage) {
            expect(errorMessage).toMatch(expectedMessage)
        }

    }
}