import { Tickets, sync } from '../src/models';
import ticketManager from '../src/managers/ticketManager';

beforeAll(async () => {
  await sync;
});

// Testing adding a new article
describe('Adding ticket', () => {
  let id;
  it('correct data', done => {
    ticketManager.addTicket('TicketTest', 'Dette er en test som skal funke', 1.11, 2.22, 1, 1, 1, function(ticket) {
      id = ticket.id;
      Tickets.findOne({ where: { id: ticket.id } }).then(tickets => {
        //console.log(tickets);
        expect({
          title: tickets.title,
          description: tickets.description,
          status: 1,
          lat: tickets.lat,
          lon: tickets.lon,
          categoryId: tickets.categoryId,
          municipalId: tickets.municipalId,
          userId: tickets.userId
        }).toEqual({
          title: 'TicketTest',
          description: 'Dette er en test som skal funke',
          status: 1,
          lat: 1.11,
          lon: 2.22,
          categoryId: 1,
          municipalId: 1,
          userId: 1
        });
        done();
      });
    });
  });
});

/*
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
    newsManager.getLocalNews(1, function(news) {
      console.log(news.success);
      expect({
        success: news.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
});
*/
