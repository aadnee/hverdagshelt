import api from './api';

class CategoryServices {
  getCategories() {
    return api.get('/api/categories');
  }

  getSubCategories(id) {
    return api.get('/api/categories/' + id);
  }

  //maybe add a municipalId as param
  addCategory(name, parentId) {
    return api.post('/api/categories', {
      name: name,
      parentId: parentId
    });
  }

  editCategory(categoryId, name) {
    return api.put('/api/categories/' + categoryId, {
      name: name
    });
  }

  deleteCategory(categoryId) {
    return api.delete('/api/categories/' + categoryId);
  }
}

export let categoryService = new CategoryServices();
