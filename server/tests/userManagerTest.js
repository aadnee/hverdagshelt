import userManager from '../src/managers/userManager';

jest.setTimeout(30000);

//Test for registering an account in use
describe('Registering in use account', () => {
  it('Wrong data', done => {
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
  //Test for login with wrong email
  it('Wrong email', done => {
    userManager.login('feilbruker@ikkelogin', '123', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Authentication failed. User not found.'
      });
      done();
    });
  });
  //Test for login with wrong password
  it('Wrong password', done => {
    userManager.login('user@user.com', 'FeilPass', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Authentication failed. Wrong password.'
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
    userManager.editUser('Nytt Navn', 'user1@user1.com', 32145, 1, 1, true, 2, function(result) {
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

//Test for adding a municipal with correct data
describe('Adding municipal to a user', () => {
  it('Correct data', done => {
    userManager.addMunicipal(1, 7, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Municipal added.'
      });
      done();
    });
  });
  //Test for adding a municipal with wrong data
  it('Wrong data', done => {
    userManager.addMunicipal(1, 7, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'User already added this municipal.'
      });
      done();
    });
  });
});

//Test for deleting a municipal
describe('Deleting municipal', () => {
  it('Correct data', done => {
    userManager.deleteMunicipal(1, 7, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Municipal deleted.'
      });
      done();
    });
  });
});
//Tests for changing password
describe('Change password', () => {
  //This test when the user doesn't excists
  it('User not found', done => {
    userManager.changePass(null, 'OldPass', 'NewPass', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'User not found.'
      });
      done();
    });
  });
  //This test when old password is wrong
  it('Old password is wrong', done => {
    userManager.changePass(1, 'FeilPassord', '123', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Wrong password.'
      });
      done();
    });
  });
});
