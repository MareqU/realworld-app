import { User } from '../../../../src/models/user';
import { faker } from '@faker-js/faker';


export const createdUserPayload = (overrides?: Partial<User>): Partial<User> => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.username(),
        password: 's3cret_password',
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        avatar: faker.image.avatar(),
        ...overrides,
    }
}