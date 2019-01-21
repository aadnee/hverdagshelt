import { sync } from '../src/models';
import companyManager from '../src/managers/companyManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

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
//Test for editing company with correct data
describe('Edit and delete company', () => {
  it('correct data', done => {
    companyManager.editCompany('Nytt Firma Navn', 'copmany1@company1.com', 321, 1, 4, true, function(result) {
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
    companyManager.deleteCompany(4, function(result) {
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
//Mangler getTasks
//Mangler finnishTasks
