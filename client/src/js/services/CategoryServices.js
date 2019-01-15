import api from './api';

class CategoryServices {
  getCategories() {
    return api.get('/api/categories');
  }

  getSubCategories(id) {
    return api.get('api/categories/' + id);
  }

  //maybe add a municipalId as param
  addCategory(name, parentId) {
    return api.post('api/categories', {
      name: name,
      parentId: parentId
    });
  }

  deleteCategory() {}
}

export let categoryService = new CategoryServices();
