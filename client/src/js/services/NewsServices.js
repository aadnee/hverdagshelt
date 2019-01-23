import api from './api';

class NewsService {
  updateNews(id, title, description, categoryId, status, published, companyId) {
    console.log(categoryId);
    return api.put('/api/news/' + id, {
      title: title,
      description: description,
      status: status,
      categoryId: categoryId,
      published: published,
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
}

export let newsService = new NewsService();
