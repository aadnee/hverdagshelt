import { News, sync } from '../src/models';
import newsManager from '../src/managers/newsManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

// Testing adding a new article
describe('Adding article', () => {
  let id;
  it('correct data', done => {
    newsManager.addArticle('TestArticle', 'Dette er en test som skal funke', 1, 1.123, 2.234, 1, function(article) {
      id = article.id;
      News.findOne({ where: { id: article.id } }).then(news => {
        expect({
          title: news.title,
          description: news.description,
          status: news.status,
          categoryId: news.categoryId,
          lat: news.lat,
          lon: news.lon,
          municipalId: news.municipalId
        }).toEqual({
          title: 'TestArticle',
          description: 'Dette er en test som skal funke',
          status: 1,
          categoryId: 1,
          lat: 1.123,
          lon: 2.234,
          municipalId: 1
        });
        done();
      });
    });
  });
  it('correct data', done => {
    newsManager.updateNews(id, 'TestArticle', 'Nå skal det ha skjedd en endring', 1, 1, 1, function(article) {
      News.findOne({ where: { id: id } }).then(news => {
        expect({
          title: news.title,
          description: news.description,
          status: news.status,
          categoryId: news.categoryId,
          companyId: news.companyId
        }).toEqual({
          title: 'TestArticle',
          description: 'Nå skal det ha skjedd en endring',
          status: 1,
          categoryId: 1,
          companyId: 1
        });
        done();
      });
    });
  });
});

describe('Get news by municipal', () => {
  it('correct data', done => {
    newsManager.getFilteredNews([1], [2], function(news) {
      expect({
        success: news.success
      }).toEqual({
        success: true
      });
      expect(news.data).toHaveLength(1);
      done();
    });
  });
});
