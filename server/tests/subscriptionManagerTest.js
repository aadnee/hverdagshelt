import { sync } from '../src/models';
import subscriptionManager from '../src/managers/subscriptionManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

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
          status: 1,
          lat: 1,
          lon: 1,
          categoryId: 2,
          municipalId: 1
        },
        {
          title: 'Enda en nyhet!',
          description: 'Brøytestikker skal bli satt opp.',
          status: 1,
          lat: 1,
          lon: 1,
          categoryId: 1,
          municipalId: 1
        },
        {
          title: 'En nyhet',
          description: 'Nyhet beskrivelse.',
          status: 1,
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
