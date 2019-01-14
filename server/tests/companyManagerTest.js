import { Users, sync } from '../src/models';
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
});

describe('Edit and delete company', () => {
  it('correct data', done => {
    companyManager.editCompany('Nytt Firma Navn', 'copmany1@company1.com', 321, 1, 4, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: true,
        message: 'Company updated.'
      });
      done();
    });
  });

  it('correct data', done => {
    companyManager.deleteCompany(4, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: true,
        message: 'Company deleted.'
      });
      done();
    });
  });
});
