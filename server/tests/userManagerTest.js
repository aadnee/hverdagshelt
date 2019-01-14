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

describe('Login with correct details', () => {
  it('correct data', done => {
    userManager.login('user@user.com', '123', function(result) {
      expect({
        success: result.success,
        message: result.message,
        rank: result.rank,
        municipalId: result.municipalId
      }).toEqual({
        success: true,
        message: 'Authentication successful.',
        rank: 1,
        municipalId: 1
      });
      done();
    });
  });
});

describe('Finding all users', () => {
  it('correct data', done => {
    userManager.getUsers(function(users) {
      expect({
        success: users.success
      }).toEqual({
        success: true
      });
      expect(users.data).toHaveLength(3);
      done();
    });
  });

  it('correct data', done => {
    userManager.getUser(1, function(user) {
      expect({
        success: user.success,
        data: {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
          phone: user.data.phone,
          rank: user.data.rank,
          municipalId: user.data.municipalId
        }
      }).toEqual({
        success: true,
        data: {
          id: 1,
          name: 'Ola',
          email: 'user@user.com',
          phone: 123,
          rank: 1,
          municipalId: 1
        }
      });
      done();
    });
  });
});

describe('Edit and delete user', () => {
  it('correct data', done => {
    userManager.editUser('Nytt Navn', 'user1@user1.com', 321, 1, 1, 2, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: true,
        message: 'User updated.'
      });
      done();
    });
  });

  it('correct data', done => {
    userManager.deleteUser(1, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: true,
        message: 'User deleted.'
      });
      done();
    });
  });
});
