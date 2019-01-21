import { sync } from '../src/models';
import subscriptionManager from '../src/managers/subscriptionManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});
//Test for finding subscriptions based on userId
describe('Finding users subscriptions', () => {
  it('correct data', done => {
    subscriptionManager.getSubscriptions(1, function(subscriptions) {
      expect({
        success: subscriptions.success
      }).toEqual({
        success: true
      });
      expect(
        subscriptions.data
          .map(subs => subs.toJSON())
          .map(subs => ({
            title: subs.title,
            description: subs.description,
            status: subs.status,
            lat: subs.lat,
            lon: subs.lon,
            categoryId: subs.categoryId,
            municipalId: subs.municipalId
          }))
      ).toEqual([
        {
          title: 'Problem ved vei i TRD sentrum.',
          description: 'Brøytestikker skal bli satt opp.',
          status: 2,
          lat: 1,
          lon: 1,
          categoryId: 2,
          municipalId: 1
        },
        {
          title: 'Enda en nyhet!',
          description: 'Brøytestikker skal bli satt opp.',
          status: 2,
          lat: 1,
          lon: 1,
          categoryId: 1,
          municipalId: 1
        },
        {
          title: 'En nyhet',
          description: 'Nyhet beskrivelse.',
          status: 2,
          lat: 1,
          lon: 1,
          categoryId: 1,
          municipalId: 1
        }
      ]);
      done();
    });
  });
});

describe('Adding and removing subscriptions', () => {
  it('Checking length before adding', done => {
    subscriptionManager.getSubscriptions(2, function(subscriptions) {
      expect(subscriptions.data).toHaveLength(0);
      done();
    });
  });
  //Test for adding subscription with correct data
  it('Adding', done => {
    subscriptionManager.addSubscription(3, 2, function(subscription) {
      expect({
        success: subscription.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  //Test that the length of data is correct after adding
  it('Checking length after adding', done => {
    subscriptionManager.getSubscriptions(2, function(subscriptions) {
      expect(subscriptions.data).toHaveLength(1);
      done();
    });
  });
  //Test for deleting a subscription
  it('Deleteing subscription', done => {
    subscriptionManager.deleteSubscription(3, 2, function(subscription) {
      expect({
        success: subscription.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
  //Test that the length of data is correct after deleting
  it('Checking length after deleteing', done => {
    subscriptionManager.getSubscriptions(2, function(subscriptions) {
      expect(subscriptions.data).toHaveLength(0);
      done();
    });
  });
});
