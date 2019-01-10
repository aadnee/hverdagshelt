import { Users, Companies, Municipals, Categories, Tickets, News, Subscriptions, sync } from '../src/models.js';

beforeAll(async () => {
  await sync;
});

// Testing the Users table in the database
describe('Users test', () => {
  it('correct data', async () => {
    let user = await Users.findOne({where: {id: 1}});
    expect({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        rank: user.rank
    }).toEqual(
      {
        firstName: 'Ola',
        lastName: 'Nordmann',
        email: 'test@test.com',
        phone: 123,
        rank: 3
      }
    );
  });
});
/*
// Testing the Companies table in the database
describe('Companies test', () => {
  it('correct data', async () => {
    let company = await Companies.findOne({where: {id: 1}});
    expect({
      name: company.name,
      email: company.email,
      phone: company.phone,
      password: company.password,
      municipalId: company.municipalId
    }).toEqual(
      {
        name: 'SmartPark',
        email: 'admin@smartpark.no',
        phone: 12345678,
        password: '12345',
        municipalId: 1
      }
    );
  });
});

// Testing the Municipals table in the database
describe('Municipals test', () => {
  it('correct data', async () => {
    let municipal = await Municipals.findOne({where: {id: 1}});
    expect({
      name: municipal.name
    }).toEqual(
      {
        name: 'Lindesnes'
      }
    );
  });
});

// Testing the Categories table in the database
describe('Categories test', () => {
  it('correct data', async () => {
    let category = await Categories.findOne({where: {id: 1}});
    expect({
      name: category.name,
    }).toEqual(
      {
        name: 'Vei og trafikk',
      }
    );
  });
});

// Testing the Tickets table in the database
describe('Tickets test', () => {
  it('correct data', async () => {
    let ticket = await Tickets.findOne({where: {id: 1}});
    expect({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      categoryId: ticket.categoryId
    }).toEqual(
      {
        title: 'Vei problem',
        description: 'Pls sett opp brøytestikker her.',
        status: 3,
        categoryId: 2
      }
    );
  });
});
*/