import { APIRequestContext, APIResponse } from "@playwright/test";

export class BankTransfersApi {
    private readonly request: APIRequestContext;
    public readonly bankTransfers = '/bankTransfers';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getBankTransfers(): Promise<APIResponse> {
        return this.request.get(this.bankTransfers);
    }
}
