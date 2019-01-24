import { Tickets, Uploads } from '../src/models';
import ticketManager from '../src/managers/ticketManager';

jest.setTimeout(30000);

// Testing adding a new article
describe('Adding ticket', () => {
  it('correct data', done => {
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
//Test for editing a ticket with correct data
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
//Test for setting status on a ticket with correct data
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
  //Test for setting status on a ticket with wrong data
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
// Test for getting tickets based on userID
describe('Get tickets by userId', () => {
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
//Test for getting tickets based on municipalID
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
//Test for making a ticket into an article
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
//Test for removing a ticket with correct data
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
  //Test for removing a ticket with wrong data
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

// Test for ticket statistics
describe('Ticket statistics testing', () => {
  it('correct data', done => {
    ticketManager.getTicketStatistics(1, 2019, null, 4, function(result) {
      expect({
        success: result.success,
        start: result.start,
        end: result.end
      }).toEqual({
        success: true,
        start: '21/01/2019',
        end: '28/01/2019'
      });
      done();
    });
  });
  it('incorrect data', done => {
    ticketManager.getTicketStatistics(1, null, null, 4, function(result) {
      expect({
        success: result.success,
        message: result.message
      }).toEqual({
        success: false,
        message: 'MunicipalId and year is required'
      });
      done();
    });
  });
});
