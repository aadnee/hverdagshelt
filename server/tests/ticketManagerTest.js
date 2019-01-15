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
    ticketManager.addTicket('TicketTest', 'Dette er en test som skal funke', 1.11, 2.22, 1, 1, 1, function(ticket) {
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

  it('correct data', done => {
    ticketManager.editTicket('TicketTest', 'Nå skal det ha skjedd en endring', 1.11, 2.22, 1, 1, 1, id, function(
      ticket
    ) {
      Tickets.findOne({ where: { id: id } }).then(tickets => {
        expect({
          title: tickets.title,
          description: tickets.description,
          status: tickets.status,
          lat: tickets.lat,
          lon: tickets.lon,
          categoryId: tickets.categoryId,
          municipalId: tickets.municipalId,
          userId: tickets.userId
        }).toEqual({
          title: 'TicketTest',
          description: 'Nå skal det ha skjedd en endring',
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

describe('Setting status', () => {
  it('correct data', done => {
    ticketManager.setStatus(1, 4, function(ticket) {
      expect({
        success: ticket.success,
        message: ticket.message
      }).toEqual({
        success: true,
        message: 'Status updated.'
      });
      done();
    });
  });
});
