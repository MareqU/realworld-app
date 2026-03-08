import { faker } from '@faker-js/faker';

type BankAccountPayload = {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
};

export const createBankAccountPayload = (overrides?: Partial<BankAccountPayload>): BankAccountPayload => {
    return {
        bankName: `${faker.company.name()} Bank`,
        accountNumber: faker.finance.accountNumber(10),
        routingNumber: faker.finance.accountNumber(9),
        ...overrides,
    };
};
