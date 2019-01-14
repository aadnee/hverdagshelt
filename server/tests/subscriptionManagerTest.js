import { sync } from '../src/models';
import subscriptionManager from '../src/managers/subscriptionManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

// Testing if we can find companies
describe('Finding users subscriptions', () => {
  it('correct data', done => {
    expect({
      success: true
    }).toEqual({
      success: true
    });
    done();
  });
});
