import subscriptionManager from '../src/managers/subscriptionManager';

jest.setTimeout(30000);

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
