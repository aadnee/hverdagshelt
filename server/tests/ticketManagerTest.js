import { Tickets, sync } from '../src/models';
import ticketManager from '../src/managers/ticketManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

// Testing adding a new article
describe('Adding ticket', () => {
  let id;
  it('correct data', done => {
    ticketManager.addTicket('TicketTest', 'Dette er en test som skal funke', 1.11, 2.22, 1, 1, true, 1, null, function(
      ticket
    ) {
      id = ticket.id;
      Tickets.findOne({ where: { id: ticket.id } }).then(tickets => {
        expect({
          title: tickets.title,
          description: tickets.description,
          status: 1,
          lat: tickets.lat,
          lon: tickets.lon,
          categoryId: tickets.categoryId,
          municipalId: tickets.municipalId,
          subscribed: tickets.subscribed,
          userId: tickets.userId
        }).toEqual({
          title: 'TicketTest',
          description: 'Dette er en test som skal funke',
          status: 1,
          lat: 1.11,
          lon: 2.22,
          categoryId: 1,
          municipalId: 1,
          subscribed: true,
          userId: 1
        });
        done();
      });
    });
  });

  it('correct data', done => {
    ticketManager.editTicket(
      'TicketTest',
      'Nå skal det ha skjedd en endring',
      1.11,
      2.22,
      1,
      1,
      true,
      1,
      id,
      null,
      function(ticket) {
        Tickets.findOne({ where: { id: id } }).then(tickets => {
          expect({
            title: tickets.title,
            description: tickets.description,
            status: tickets.status,
            lat: tickets.lat,
            lon: tickets.lon,
            categoryId: tickets.categoryId,
            municipalId: tickets.municipalId,
            subscribed: tickets.subscribed,
            userId: tickets.userId
          }).toEqual({
            title: 'TicketTest',
            description: 'Nå skal det ha skjedd en endring',
            status: 1,
            lat: 1.11,
            lon: 2.22,
            categoryId: 1,
            municipalId: 1,
            subscribed: true,
            userId: 1
          });
          done();
        });
      }
    );
  });
});

describe('Setting status', () => {
  it('correct data', done => {
    ticketManager.setStatus(1, 4, 1, function(ticket) {
      expect({
        success: ticket.success,
        message: ticket.message.en
      }).toEqual({
        success: true,
        message: 'Status updated.'
      });
      done();
    });
  });

  it('Wrong data', done => {
    ticketManager.setStatus('String', 4, 1, function(ticket) {
      expect({
        success: ticket.success
        //  message: ticket.message.en
      }).toEqual({
        success: false
        //  message: err
      });
      done();
    });
  });
});

describe('Get news by userId', () => {
  it('correct data', done => {
    ticketManager.getMyTickets(1, function(tickets) {
      Tickets.findAll({ where: { userId: 1 } }).then(res => {
        expect({
          success: tickets.success,
          data: res
        }).toEqual({
          success: true,
          data: res
        });
        done();
      });
    });
  });

  /*
  it('Wrong data', done => {
    ticketManager.getMyTickets(, function(ticket) {
      expect({
        success: ticket.success
      }).toEqual({
        success: false
      });
      done();
    });
  });
});
*/

  describe('Get local tickets', () => {
    it('correct data', done => {
      ticketManager.getLocalTickets(1, function(tickets) {
        Tickets.findAll({ where: { municipalId: 1, status: 1 } }).then(res => {
          expect({
            success: tickets.success,
            data: res
          }).toEqual({
            success: true,
            data: res
          });
          done();
        });
      });
    });
  });

  describe('Make a ticket to an article', () => {
    it('correct data', done => {
      ticketManager.makeNews(4, 'TicketTest', 'Nå skal det ha skjedd en endring', 1.11, 2.22, 1, 1, function(result) {
        expect({
          success: result.success,
          message: result.message.en
        }).toEqual({
          success: true,
          message: 'Article added.'
        });
        done();
      });
    });
  });
});
