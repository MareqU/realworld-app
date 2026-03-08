import { APIRequestContext, APIResponse } from "@playwright/test";

export class CommentsApi {
    private readonly request: APIRequestContext;
    public readonly comments = '/comments';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getCommentsForTransaction(transactionId: string): Promise<APIResponse> {
        return this.request.get(`${this.comments}/${transactionId}`);
    }

    async createComment(transactionId: string, content: string): Promise<APIResponse> {
        return this.request.post(`${this.comments}/${transactionId}`, { data: { content } });
    }
}
