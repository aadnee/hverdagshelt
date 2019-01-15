import { sync } from '../src/models';
import categoryManager from '../src/managers/categoryManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

describe('CategoryManager tests', () => {
  it('correct data', done => {
    categoryManager.getCategories(function(result) {
      expect({
        success: result.success,
        name: result.data[0].name
      }).toEqual({
        success: true,
        name: 'Vei og trafikk'
      });
      done();
    });
  });

  it('correct data', done => {
    categoryManager.addCategory('Skog og utmark', null, function(result) {
      expect({
        success: result.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  it('correct data', done => {
    categoryManager.getSubCategories(1, function(result) {
      expect({
        success: result.success,
        name: result.data[0].name
      }).toEqual({
        success: true,
        name: 'Setting av brøytestikker'
      });
      done();
    });
  });
});
