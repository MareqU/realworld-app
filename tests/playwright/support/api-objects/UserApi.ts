import { APIRequestContext, APIResponse } from "@playwright/test";
import { test } from "../../fixtures";

export class UserApi {
    private readonly request: APIRequestContext;
    private readonly endpoint = '/users';
    private readonly profile = '/profile/';

    constructor(request: APIRequestContext) {
        this.request = request
    }

    // Method to fetch all users
    async getAllUsers(): Promise<APIResponse> {
        return await this.request.get(this.endpoint);
    }

    // Method to fetch a specific user by ID
    async getUserById(userId: string): Promise<APIResponse> {
        return await this.request.get(`${this.endpoint}/${userId}`);
    }

    // Method to fetch a specific profile by username
    async getUserProfileByUserName(username: string): Promise<APIResponse> {
        return await this.request.get(`${this.endpoint}${this.profile}${username}`);
    }
    
}
