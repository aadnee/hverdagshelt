import companyManager from '../src/managers/companyManager';

// Testing if we can find companies
describe('Finding all companies', () => {
  it('correct data', done => {
    companyManager.getCompanies(function(companies) {
      expect({
        success: companies.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  //Test for finding companies based on municipalID
  it('correct data', done => {
    companyManager.getLocalCompanies(1, function(companies) {
      expect({
        success: companies.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  //Test for finding a company based on ID
  it('correct data', done => {
    companyManager.getCompany(4, function(company) {
      expect({
        success: company.success,
        data: {
          email: company.data.email,
          id: company.data.id,
          municipalId: company.data.municipalId,
          name: company.data.name,
          phone: company.data.phone
        }
      }).toEqual({
        success: true,
        data: {
          email: 'company@company.com',
          id: 4,
          municipalId: 1,
          name: 'SmartPark',
          phone: 12345678
        }
      });
      done();
    });
  });
});
//Tests for adding,editing and deleting a company with correct data
describe('Add, edit and delete company', () => {
  let id;
  it('Correct data', done => {
    companyManager.addCompany('TestFirma', 'compmany1@company1.com', 69696969, 1, function(result) {
      id = result.id;
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Registration successful.'
      });
      done();
    });
  });
  //Test for editing a company
  it('correct data', done => {
    companyManager.editCompany('Nytt Firma Navn', 'copmany1@company1.com', 3212, 1, 1, true, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Company updated.'
      });
      done();
    });
  });
  //Test for deleting company with correct data
  it('correct data', done => {
    companyManager.deleteCompany(id, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Company deleted.'
      });
      done();
    });
  });
});

//Tests about the tasks given the companies
describe('Finding,accepting, rejecting and finnishing tasks', () => {
  it('Get tasks, correct data', done => {
    companyManager.getTasks(4, function(result) {
      expect({
        success: result.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  //Test for accepting a task with correct data
  it('Accept tasks, correct data', done => {
    companyManager.acceptTask(4, 1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Task accepted.'
      });
      done();
    });
  });
  //Test for rejecting a task with correct data
  it('Reject task, correct data', done => {
    companyManager.rejectTask(4, 1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Task rejected.'
      });
      done();
    });
  });
  //Test for setting a task to finished with correct data
  it('Finish task, correct data', done => {
    companyManager.finishTask(4, 1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Task finished.'
      });
      done();
    });
  });
});
