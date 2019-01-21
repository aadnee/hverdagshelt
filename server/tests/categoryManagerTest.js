import { sync } from '../src/models';
import categoryManager from '../src/managers/categoryManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

describe('Get categories', () => {
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
});

describe('Adding category', () => {
  let id;
  it('correct data', done => {
    categoryManager.addCategory('Skog og utmark', null, function(result) {
      id = result.id;
      expect({
        success: result.success
      }).toEqual({
        success: true
      });
      done();
    });
  });

  it('Wrong data', done => {
    categoryManager.addCategory('Skog og utmark', 12, function(result) {
      expect({
        success: result.success
      }).toEqual({
        success: false
      });
      done();
    });
  });

  it('Correct data', done => {
    categoryManager.deleteCategory(id, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Category deleted.'
      });
      done();
    });
  });

  it('Wrong data', done => {
    categoryManager.deleteCategory(null, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Cannot delete a category with subcategories.'
      });
      done();
    });
  });
});

describe('Edit categories', () => {
  it('Correct data', done => {
    categoryManager.editCategory(1, 'Endring skjedd', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Category updated successfully'
      });
      done();
    });
  });

  it('Wrong data', done => {
    categoryManager.editCategory(0, 'Endring skjedd', function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Category not found.'
      });
      done();
    });
  });
});

describe('get subCategories', () => {
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
