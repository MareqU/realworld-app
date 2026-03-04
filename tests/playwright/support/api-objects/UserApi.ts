import { APIRequestContext, APIResponse } from "@playwright/test";

export class UserApi {
    private readonly request: APIRequestContext;
    public readonly users = '/users';
    public readonly profile = '/profile/';
    public readonly search = '/search';

    constructor(request: APIRequestContext) {
        this.request = request
    }

    // Method to fetch all users
    async getAllUsers(): Promise<APIResponse> {
        return this.request.get(this.users);
    }

    // Method to fetch a specific user by ID
    async getUserById(userId: string): Promise<APIResponse> {
        return this.request.get(`${this.users}/${userId}`);
    }

    // Method to fetch a specific profile by username
    async getUserProfileByUserName(username: string): Promise<APIResponse> {
        return this.request.get(`${this.users}${this.profile}${username}`);
    }

    async getUserByEmail(email: string): Promise<APIResponse> {
        return this.request.get(`${this.users}${this.search}`, {
            params: {
                q: email
            }
        })
    }

    async postNewUser(userData: Object): Promise<APIResponse> {
        return this.request.post(this.users, {
            data: userData
        })
    }

    async patchUser(userId: string, newField: Object): Promise<APIResponse> {
        return this.request.patch(`${this.users}/${userId}`, {
            data: newField
        });
    }
    
}
