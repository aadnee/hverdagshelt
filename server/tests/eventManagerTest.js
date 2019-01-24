import { Events } from '../src/models.js';
import eventManager from '../src/managers/eventManager.js';

// Testing event
describe('Adding, editing and deleting event', () => {
  let id;
  //Test for adding event
  it('Adding event, Correct data', done => {
    eventManager.addEvent(
      'TestEvent',
      'Test description event',
      'Textfield',
      'TestAdress',
      '2019-01-09 00:00:00',
      '2019-01-10 00:00:00',
      1,
      '',
      function(result) {
        id = result.id;
        expect({
          success: result.success,
          message: result.message.en
        }).toEqual({
          success: true,
          message: 'Event added.'
        });
        done();
      }
    );
  });
  //Test for editing event
  it('Editing event, correct data', done => {
    eventManager.editEvent(
      id,
      'Testedit',
      'Editing description',
      'textfield',
      'En annen adresse',
      '2019-02-09 00:00:00',
      '2019-02-19 00:00:00',
      1,
      '',
      function(result) {
        expect({
          success: result.success,
          message: result.message.en
        }).toEqual({
          success: true,
          message: 'Event edited.'
        });
        done();
      }
    );
  });
  //Test for deleting event
  it('Deleting event, correct data', done => {
    eventManager.deleteEvent(id, function(result) {
      expect({
        success: result.success,
        message: result.message.en
      }).toEqual({
        success: true,
        message: 'Event deleted.'
      });
      done();
    });
  });
});
//Getting filtered news on a non-existing municipalID
describe('Filtered Events', () => {
  it('Correct data', done => {
    eventManager.getFilteredEvents(-12451245, 2, 10, function(result) {
      expect({
        success: result.success,
        data: result.data
      }).toEqual({
        success: true,
        data: []
      });
      done();
    });
  });
});
