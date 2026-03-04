import { APIRequestContext, APIResponse } from "@playwright/test";
import { TransactionRequestStatus } from '../../../../src/models/transaction';

export class TransactionsApi {
    private readonly request: APIRequestContext;
    public readonly transactions = '/transactions'

    constructor(request: APIRequestContext) {
        this.request = request
    }

    async getAllTransactions(params?: Record<string, string | number | boolean>): Promise<APIResponse> {
        return this.request.get(this.transactions, {
            params: params
        });
    }

    async getContactTransactions(params?: Record<string, string | number | boolean>): Promise<APIResponse> {
        return this.request.get(`${this.transactions}/contacts`, {
            params: params
        });
    }

    async getPublicTransactions(): Promise<APIResponse> {
        return this.request.get(`${this.transactions}/public`);
    }

    async createTransaction(body: Record<string, string | number>): Promise<APIResponse> {
        return this.request.post(this.transactions, { data: body });
    }

    async updateTransaction(transactionId: string, body: Record<string, string>): Promise<APIResponse> {
        return this.request.patch(`${this.transactions}/${transactionId}`, { data: body });
    }

}