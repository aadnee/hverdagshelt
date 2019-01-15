import { sync } from '../src/models';
import municipalManager from '../src/managers/municipalManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

describe('MunicipalManager tests', () => {
  it('correct data', done => {
    municipalManager.getMunicipals(function(result) {
      expect({
        success: result.success,
        name: result.data[0].name
      }).toEqual({
        success: true,
        name: 'Lindesnes'
      });
      done();
    });
  });

  it('correct data', done => {
    municipalManager.addMunicipal('Trondheim', function(result) {
      expect({
        success: result.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
});