import api from './api';

class NewsService {
  updateNews(id, title, description, published, categoryId) {
    console.log(categoryId);
    return api.put('/api/news/' + id, {
      title: title,
      description: description,
      published: published,
      categoryId: categoryId
    });
  }

  finishNews(id) {
    return api.put('/api/news/' + id + '/finish');
  }

  assignCompany(id, companyId) {
    return api.put('/api/news/' + id + '/company', {
      companyId: companyId
    });
  }

  getFilteredNews(municipalIds, categoryIds, page, limit) {
    return api.post('/api/news/filter', {
      municipalIds: municipalIds,
      categoryIds: categoryIds,
      page: page,
      limit: limit
    });
  }

  getArcivedNews(municipalIds, categoryIds, page, limit) {
    return api.post('/api/news/archive', {
      municipalIds: municipalIds,
      categoryIds: categoryIds,
      page: page,
      limit: limit
    });
  }

  getNews() {
    return api.get('/api/news');
  }
}

export let newsService = new NewsService();
