import { APIRequestContext, APIResponse } from "@playwright/test";

export class LoginApi {
    private readonly request: APIRequestContext;
    public readonly login = '/login';
    public readonly logout = '/logout';

    constructor (requset: APIRequestContext) {
        this.request = requset
    };

    // method to valid login
    async validLogin(): Promise<APIResponse> {
        return this.request.post(this.login, {
            // Only temporary solution, It would be taken from .env
            data: {
                username: process.env.TEST_USER,
                password: process.env.TEST_PASS
            }
        });
    }

    // Method to invalid login
    async invalidLogin(): Promise<APIResponse> {
        return this.request.post(this.login, {
            data: {
                username: 'Heath93',
                password: 'wrongOne123'
            }
        });
    }

    // Method to logout
    async logoutUser(): Promise<APIResponse> {
        return this.request.post(this.logout);
    }
}