import { APIRequestContext, APIResponse } from "@playwright/test";

export class BankAccountsApi {
    private readonly request: APIRequestContext;
    public readonly bankAccounts = '/bankAccounts';
    public readonly graphql = '/graphql';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getBankAccounts(): Promise<APIResponse> {
        return this.request.get(this.bankAccounts);
    }

    async getBankAccount(bankAccountId: string): Promise<APIResponse> {
        return this.request.get(`${this.bankAccounts}/${bankAccountId}`);
    }

    async createBankAccount(body: { bankName: string; accountNumber: string; routingNumber: string }): Promise<APIResponse> {
        return this.request.post(this.bankAccounts, { data: body });
    }

    async deleteBankAccount(bankAccountId: string): Promise<APIResponse> {
        return this.request.delete(`${this.bankAccounts}/${bankAccountId}`);
    }

    async graphqlListBankAccounts(): Promise<APIResponse> {
        return this.request.post(this.graphql, {
            data: {
                query: `query {
                    listBankAccount {
                        id uuid userId bankName accountNumber routingNumber isDeleted createdAt modifiedAt
                    }
                }`,
            },
        });
    }

    async graphqlCreateBankAccount(body: { bankName: string; accountNumber: string; routingNumber: string }): Promise<APIResponse> {
        return this.request.post(this.graphql, {
            data: {
                query: `mutation createBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {
                    createBankAccount(bankName: $bankName, accountNumber: $accountNumber, routingNumber: $routingNumber) {
                        id uuid userId bankName accountNumber routingNumber isDeleted createdAt
                    }
                }`,
                variables: body,
            },
        });
    }

    async graphqlDeleteBankAccount(bankAccountId: string): Promise<APIResponse> {
        return this.request.post(this.graphql, {
            data: {
                query: `mutation deleteBankAccount($id: ID!) {
                    deleteBankAccount(id: $id)
                }`,
                variables: { id: bankAccountId },
            },
        });
    }
}
