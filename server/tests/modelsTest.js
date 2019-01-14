import { Users, Companies, Municipals, Categories, Tickets, News, Subscriptions, sync } from '../src/models.js';
import newsManager from '../src/managers/newsManager';

jest.setTimeout(30000);

beforeAll(async () => {
  await sync;
});

// Testing the Municipals table in the database
describe('Municipals test', () => {
  it('correct data', async () => {
    let municipal = await Municipals.findOne({ where: { id: 1 } });
    expect({
      name: municipal.name
    }).toEqual({
      name: 'Lindesnes'
    });
  });
});

// Testing the Categories table in the database
describe('Categories test', () => {
  it('correct data', async () => {
    let category = await Categories.findOne({ where: { id: 1 } });
    expect({
      name: category.name
    }).toEqual({
      name: 'Vei og trafikk'
    });
  });
});

// Testing the Tickets table in the database
describe('Tickets test', () => {
  it('correct data', async () => {
    let ticket = await Tickets.findOne({ where: { id: 1 } });
    expect({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      categoryId: ticket.categoryId
    }).toEqual({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 1,
      categoryId: 2
    });
  });
});
