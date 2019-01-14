import { Users, sync } from '../src/models';
import companyManager from '../src/managers/companyManager';

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
