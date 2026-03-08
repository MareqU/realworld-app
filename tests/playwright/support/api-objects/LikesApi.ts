import { APIRequestContext, APIResponse } from "@playwright/test";

export class LikesApi {
    private readonly request: APIRequestContext;
    public readonly likes = '/likes';

    constructor(request: APIRequestContext) {
        this.request = request;
    };

    async getLikesForTransaction(transactionId: string): Promise<APIResponse> {
        return this.request.get(`${this.likes}/${transactionId}`);
    }

    async createLike(transactionId: string): Promise<APIResponse> {
        return this.request.post(`${this.likes}/${transactionId}`, {
            data: { transactionId }
        });
    }
}