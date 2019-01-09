import Sequelize from 'sequelize';

let sequelize = new Sequelize('fs_tdat2003_a_hverdagshelt', 'fs_tdat2003_a_hverdagshelt', 'slackmaster', {
  host: process.env.CI ? 'mysql' : 'mysql.stud.ntnu.no', // The host is 'mysql' when running in gitlab CI
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export let Users = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true },
  phone: { type: Sequelize.INTEGER, unique: true },
  password: Sequelize.STRING,
  rank: Sequelize.INTEGER
});

export let Companies = sequelize.define('companies', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true },
  phone: { type: Sequelize.INTEGER, unique: true },
  password: Sequelize.STRING
});

export let Municipals = sequelize.define('municipals', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true },
  postalCode: { type: Sequelize.INTEGER, unique: true }
});

export let Categories = sequelize.define('categories', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true }
});

export let Tickets = sequelize.define('tickets', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  description: { type: Sequelize.TEXT, length: 'medium' },
  status: Sequelize.INTEGER,
  lat: Sequelize.FLOAT,
  lon: Sequelize.FLOAT
});

export let News = sequelize.define('news', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  description: { type: Sequelize.TEXT, length: 'medium' },
  status: Sequelize.INTEGER,
  lat: Sequelize.FLOAT,
  lon: Sequelize.FLOAT,
  companyStatus: Sequelize.BOOLEAN
});

export let Subscriptions = sequelize.define('subscriptions');
News.belongsToMany(Users, { through: Subscriptions });
Users.belongsToMany(News, { through: Subscriptions });

Users.hasMany(Tickets);
Municipals.hasMany(Users);
Municipals.hasMany(Companies);
Categories.hasMany(Categories, { as: 'parent' });
Categories.hasMany(Tickets);
Categories.hasMany(News);
Companies.hasMany(News);
News.hasMany(Tickets);
Municipals.hasMany(Tickets);
Municipals.hasMany(News);

let production = process.env.NODE_ENV === 'production';
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production) {
    Municipals.create({
      name: 'Lindesnes',
      postalCode: 4520
    });
    Categories.create({
      name: 'Vei og trafikk'
    });
    Categories.create({
      name: 'Setting av brøytestikker',
      parentId: 1
    });
    Users.create({
      firstName: 'Ola',
      lastName: 'Jensen',
      email: 'ola.jensen@ntnu.no',
      phone: 123,
      password: '123',
      rank: 3,
      municipalId: 1
    });
    Companies.create({
      name: 'SmartPark',
      email: 'admin@smartpark.no',
      phone: 12345678,
      password: '12345',
      municipalId: 1
    });
    Tickets.create({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 3,
      categoryId: 2,
      userId: 1
    });
    News.create({
      title: 'Problem ved vei i TRD sentrum,.',
      description: 'Brøytestikker skal bli satt opp.',
      status: 1,
      categoryId: 2
    });
    Subscriptions.create({
      newsId: 1,
      userId: 1
    });
    return true;
  }
});
