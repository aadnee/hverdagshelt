import { sync } from '../src/models';
import categoryManager from '../src/managers/categoryManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});
//Test for getting categories
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
//Test for adding category with correct data
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
  //Test for adding category with wrong data
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
  // Testing for delete category with correct data
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
  // Testing for delete category with wrong data
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
//Test for edit categories with correct data
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
  //Test for edit categories with wrong data
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
