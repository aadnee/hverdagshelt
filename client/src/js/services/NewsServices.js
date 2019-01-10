import axios from 'axios';

axios.interceptors.response.use(response => response.data);

class NewsService {
  addArticle(title, description, status, categoryId, lat, lon, municipalId) {
    return axios.post('/api/news', {
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
    return axios.put('/api/news/' + id, {
      title: title,
      description: description,
      status: status,
      categoryId: categoryId,
      companyId: companyId
    });
  }

  getLocalNews(municipalId) {
    return axios.get('/api/news/municipal/' + municipalId);
  }
}

export let newsService = new NewsService();
