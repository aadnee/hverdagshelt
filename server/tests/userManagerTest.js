import userManager from '../src/managers/userManager';

jest.setTimeout(30000);

describe('Registering in use account', () => {
  it('correct data', done => {
    userManager.register('Test', 'user@user.com', 889988, 1, 1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Registration failed. Email or phone number already in use.'
      });
      done();
    });
  });
});
// Test for login with correct data
describe('Login with correct details', () => {
  it('correct data', done => {
    userManager.login('user@user.com', '123', function(result) {
      expect({
        success: result.success,
        message: result.message.en,
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
// Test for finding all users with correct data
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
  //Test for fin|ding a user based on userID
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
//Test for editing a user with correct data
describe('Edit and delete user', () => {
  it('correct data', done => {
    userManager.editUser('Nytt Navn', 'user1@user1.com', 321, 1, 1, true, 2, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'User updated.'
      });
      done();
    });
  });
  //Test for deleting a user with correct data
  it('correct data', done => {
    userManager.deleteUser(1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'User deleted.'
      });
      done();
    });
  });
});
//Test for finding municipals based on UserID. Using a nonexisting userID and checking that dataArray is empty.
describe('Finding municipals', () => {
  it('correct data', done => {
    userManager.getMunicipals(-4, function(result) {
      expect({
        success: result.success,
        data: result.data
      }).toEqual({
        success: true,
        data: []
      });
      done();
    });
  });
});
//Mangler login med feil data
//Mangler changePass
//Mangler addMunicipal med feil og riktig data
//Mangler deleteMunicipal
