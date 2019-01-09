import { Users, Companies, Municipals, Categories, Tickets, News, Subscriptions, sync } from '../src/models.js';

beforeAll(async () => {
  await sync;
});

describe('Users test', () => {
  it('correct data', async () => {
    let user = await Users.find({where: {id: 1}});
    expect({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        rank: user.rank
    }).toEqual(
      {
        firstName: 'Ola',
        lastName: 'Jensen',
        email: 'ola.jensen@ntnu.no',
        phone: 123,
        password: '123',
        rank: 3
      }
    );
  });
});

describe('Companies test', () => {
  it('correct data', async () => {
    let company = await Companies.find({where: {id: 1}});
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

describe('Municipals test', () => {
  it('correct data', async () => {
    let municipal = await Municipals.find({where: {id: 1}});
    expect({
      name: municipal.name
    }).toEqual(
      {
        name: 'Lindesnes'
      }
    );
  });
});

describe('Categories test', () => {
  it('correct data', async () => {
    let category = await Categories.find({where: {id: 1}});
    expect({
      name: category.name,
    }).toEqual(
      {
        name: 'Vei og trafikk',
      }
    );
  });
});

describe('Tickets test', () => {
  it('correct data', async () => {
    let ticket = await Tickets.find({where: {id: 1}});
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
