import api from './api';

class CategoryServices {
  getCategories() {
    return api.get('/api/categories');
  }

  getSubCategories(id) {
    return api.get('api/categories/' + id);
  }

  //maybe add a municipalId as param
  addCategory() {}

  deleteCategory() {}
}
export let categoryServices = new CategoryServices();
