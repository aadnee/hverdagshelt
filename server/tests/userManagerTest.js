import { Users, sync } from '../src/models';
import userManager from '../src/managers/userManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

describe('Registering in use account', () => {
  it('correct data', done => {
    userManager.register('Test', 'user@user.com', 889988, 1, 1, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: false,
        message: 'Registration failed. Email or phone number already in use.'
      });
      done();
    });
  });
});
