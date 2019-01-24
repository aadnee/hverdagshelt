import { News } from '../src/models';
import newsManager from '../src/managers/newsManager';

jest.setTimeout(30000);

// Testing adding a new article
describe('Adding article', () => {
  let id;
  it('correct data', done => {
    newsManager.addArticle(
      'TestArticle',
      'Dette er en test som skal funke',
      1,
      1.123,
      2.234,
      'Klæbuveien 171B',
      1,
      function(article) {
        id = article.id;
        News.findOne({ where: { id: article.id } }).then(news => {
          expect({
            title: news.title,
            description: news.description,
            status: news.status,
            categoryId: news.categoryId,
            lat: news.lat,
            lon: news.lon,
            address: news.address,
            municipalId: news.municipalId
          }).toEqual({
            title: 'TestArticle',
            description: 'Dette er en test som skal funke',
            status: 2,
            categoryId: 1,
            lat: 1.123,
            lon: 2.234,
            address: 'Klæbuveien 171B',
            municipalId: 1
          });
          done();
        });
      }
    );
  });
  //Test for updating an aritcle with correct data
  it('correct data', done => {
    newsManager.updateNews(id, 'TestArticle', 'Nå skal det ha skjedd en endring', 1, function(article) {
      News.findOne({ where: { id: id } }).then(news => {
        expect({
          title: news.title,
          description: news.description,
          categoryId: news.categoryId
        }).toEqual({
          title: 'TestArticle',
          description: 'Nå skal det ha skjedd en endring',
          categoryId: 1
        });
        done();
      });
    });
  });
  //Test for updating an article with wrong data
  it('Wrong data', done => {
    newsManager.updateNews(-14, 'TestArticle', 'Nå skal det ha skjedd en endring', 1, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Article not found.'
      });
      done();
    });
  });
});
//Test for finding filtered news
describe('Get filtered News', () => {
  it('correct data', done => {
    newsManager.getFilteredNews([1], [4], 1, 1, function(news) {
      expect({
        success: news.success
      }).toEqual({
        success: true
      });
      expect(news.data).toHaveLength(0);
      done();
    });
  });
});

// Test for finding archived news
describe('Get archived News', () => {
  it('correct data', done => {
    newsManager.getArchivedNews(1, function(news) {
      expect({
        success: news.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
});

// Test for finding news
describe('Get news', () => {
  it('correct data', done => {
    newsManager.getNews(function(news) {
      expect({
        success: news.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
});
