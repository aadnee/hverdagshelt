import { sync } from '../src/models';
import subscriptionManager from '../src/managers/subscriptionManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

describe('Finding users subscriptions', () => {
  it('correct data', done => {
    subscriptionManager.getSubscriptions(1, function(subscriptions) {
      subscriptions.data.map(subs => subs.toJSON()).map(subs => console.log(subs));
      expect({
        success: subscriptions.success
      }).toEqual({
        success: true
      });
      done();
    });
  });
});
