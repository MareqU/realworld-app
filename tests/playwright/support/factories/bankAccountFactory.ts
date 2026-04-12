import { faker } from '@faker-js/faker';

type BankAccountPayload = {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
};

export const createBankAccountPayload = (overrides?: Partial<BankAccountPayload>): BankAccountPayload => {
    return {
        bankName: `${faker.company.companyName()} Bank`,
        accountNumber: faker.finance.account(10),
        routingNumber: faker.finance.account(9),
        ...overrides,
    };
};
