import { faker } from '@faker-js/faker';

type TransactionPayload = {
    transactionType: string;
    source: string;
    receiverId: string;
    description: string;
    amount: number;
    privacyLevel: string;
}

export const createPaymentPayload = (overrides?: Partial<TransactionPayload>): TransactionPayload => {
    return {
        transactionType: 'payment',
        source: '',
        receiverId: '',
        description: faker.lorem.sentence(),
        amount: parseInt(faker.finance.amount(), 10),
        privacyLevel: 'public',
        ...overrides,
    }
}

export const createRequestPayload = (overrides?: Partial<TransactionPayload>): TransactionPayload => {
    return {
        transactionType: 'request',
        source: '',
        receiverId: '',
        description: faker.lorem.sentence(),
        amount: parseInt(faker.finance.amount(), 10),
        privacyLevel: 'public',
        ...overrides,
    }
}
