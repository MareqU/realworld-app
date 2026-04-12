import { User } from '../../../../src/models/user';
import { faker } from '@faker-js/faker';


export const createdUserPayload = (overrides?: Partial<User>): Partial<User> => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        password: 's3cret_password',
        email: faker.internet.email(),
        phoneNumber: faker.phone.phoneNumber(),
        avatar: `https://avatars.dicebear.com/api/human/${faker.random.alphaNumeric(9)}.svg`,
        ...overrides,
    }
}