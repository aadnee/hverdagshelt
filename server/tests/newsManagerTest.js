import { News, sync } from '../src/models';
import newsManager from '../src/managers/newsManager';

beforeAll(async () => {
  await sync;
});

// Testing adding a new article
describe('Adding article', () => {
  it('correct data', done => {
    newsManager.addArticle('TestArticle', 'Dette er en test som skal funke', 1, 1.123, 2.234, 1, function(article) {
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
});
