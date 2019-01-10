import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MYSQL_DB);
let sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USR, process.env.MYSQL_PWD, {
  host: process.env.CI ? 'mysql' : process.env.MYSQL_HOST, // The host is 'mysql' when running in gitlab CI
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export let Users = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true },
  phone: { type: Sequelize.INTEGER, unique: true },
  password: Sequelize.STRING,
  rank: Sequelize.INTEGER
});

export let Municipals = sequelize.define('municipals', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true }
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
Categories.hasMany(Categories, { as: 'parent' });
Categories.hasMany(Tickets);
Categories.hasMany(News);
Users.hasMany(News);
News.hasMany(Tickets);
Municipals.hasMany(Tickets);
Municipals.hasMany(News);

let production = process.env.NODE_ENV === 'production';
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production) {
    Municipals.create({
      name: 'Lindesnes'
    });
    Categories.create({
      name: 'Vei og trafikk'
    });
    Categories.create({
      name: 'Setting av brøytestikker',
      parentId: 1
    });
    Users.create({
      name: 'Ola',
      email: 'test@test.com',
      phone: 123,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 3,
      municipalId: 1
    });
    Users.create({
      name: 'SmartPark',
      email: 'admin@smartpark.no',
      phone: 12345678,
      password: '12345',
      rank: 2,
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
