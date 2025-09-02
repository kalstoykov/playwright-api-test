const { faker } = require('faker');

class TestDataGenerator {
  static generateUser(overrides = {}) {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(12),
      age: faker.datatype.number({ min: 18, max: 99 }),
      phone: faker.phone.number(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country()
      },
      ...overrides
    };
  }

  static generateProduct(overrides = {}) {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      sku: faker.datatype.uuid(),
      inStock: faker.datatype.boolean(),
      quantity: faker.datatype.number({ min: 0, max: 1000 }),
      ...overrides
    };
  }

  static generateOrder(overrides = {}) {
    return {
      userId: faker.datatype.uuid(),
      items: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => ({
        productId: faker.datatype.uuid(),
        quantity: faker.datatype.number({ min: 1, max: 10 }),
        price: parseFloat(faker.commerce.price())
      })),
      totalAmount: parseFloat(faker.commerce.price()),
      status: faker.helpers.arrayElement(['pending', 'confirmed', 'shipped', 'delivered']),
      shippingAddress: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode()
      },
      ...overrides
    };
  }

  static generateInvalidUser() {
    return {
      name: '', // Invalid: empty name
      email: 'invalid-email', // Invalid: malformed email
      password: '123', // Invalid: too short
      age: -5 // Invalid: negative age
    };
  }

  static generateLoginCredentials(valid = true) {
    if (valid) {
      return {
        email: 'test@example.com',
        password: 'validPassword123!'
      };
    }
    return {
      email: 'invalid@email',
      password: 'weak'
    };
  }

  static randomString(length = 10) {
    return faker.random.alphaNumeric(length);
  }

  static randomEmail() {
    return faker.internet.email();
  }

  static randomNumber(min = 1, max = 100) {
    return faker.datatype.number({ min, max });
  }
}

module.exports = { TestDataGenerator };