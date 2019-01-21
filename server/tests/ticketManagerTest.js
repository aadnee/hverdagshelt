import { Tickets, Uploads, sync } from '../src/models';
import ticketManager from '../src/managers/ticketManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

// Testing adding a new article

describe('Adding ticket', () => {
  it('correct data', done => {
    //  let id;
    ticketManager.addTicket(
      'TicketTest',
      'Dette er en test som skal funke',
      1.11,
      2.22,
      'Klæbuveien 171B',
      1,
      1,
      true,
      [],
      1,
      function(ticket) {
        //  id = ticket.id;
        expect({
          success: ticket.success,
          message: ticket.message.en
        }).toEqual({
          success: true,
          message: 'Ticket sent.'
        });
        done();
      }
    );
  });
});

describe('Editing ticket', () => {
  it('correct data', done => {
    let id;
    ticketManager.editTicket(
      'TicketTest',
      'Nå skal det ha skjedd en endring',
      1.11,
      2.22,
      'Klæbuveien 171B',
      1,
      1,
      true,
      1,
      id,
      function(ticket) {
        id = ticket.id;
        expect({
          success: ticket.success,
          message: ticket.message.en
        }).toEqual({
          success: true,
          message: 'Ticket saved.'
        });
        done();
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
});

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
    ticketManager.makeNews(
      4,
      'TicketTest',
      'Nå skal det ha skjedd en endring',
      1.11,
      2.22,
      'Klæbuveien 171B,',
      1,
      1,
      [0],
      function(result) {
        expect({
          success: result.success,
          message: result.message.en
        }).toEqual({
          success: true,
          message: 'Article added.'
        });
        done();
      }
    );
  });
});

describe('Withdraw ticket', () => {
  it('correct data', done => {
    ticketManager.withdraw(1, 4, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Ticket removed.'
      });
      done();
    });
  });

  it('Wrong data', done => {
    ticketManager.withdraw(0, 4, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: false,
        message: 'Access denied.'
      });
      done();
    });
  });
});
