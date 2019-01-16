import api from './api';

class NewsService {
  addArticle(title, description, status, categoryId, lat, lon, municipalId) {
    return api.post('/api/news', {
      title: title,
      description: description,
      status: status,
      categoryId: categoryId,
      lat: lat,
      lon: lon,
      municipalId: municipalId
    });
  }

  updateNews(id, title, description, status, categoryId, companyId) {
    return api.put('/api/news/' + id, {
      title: title,
      description: description,
      status: status,
      categoryId: categoryId,
      companyId: companyId
    });
  }

  getFilteredNews(municipalIds, categoryIds) {
    return api.post('/api/news/filter', {
      municipalIds: municipalIds,
      categoryIds: categoryIds
    });
  }
}

export let newsService = new NewsService();
