import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Op = Sequelize.Op;
let sequelize = new Sequelize(
  process.env.CI ? 'Group8' : process.env.MYSQL_DB,
  process.env.CI ? 'root' : process.env.MYSQL_USR,
  process.env.CI ? '' : process.env.MYSQL_PWD,
  {
    host: process.env.CI ? 'mysql' : process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $gt: Op.gt,
      $lt: Op.lt,
      $lte: Op.lte,
      $like: Op.like,
      $not: Op.ne
    },
    timezone: '+01:00'
  }
);

export let Users = sequelize.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, unique: true, allowNull: false },
  phone: { type: Sequelize.INTEGER, unique: true, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  rank: { type: Sequelize.INTEGER, allowNull: false }
});

export let Municipals = sequelize.define('municipals', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false }
});

export let Categories = sequelize.define('categories', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false }
});

export let Tickets = sequelize.define('tickets', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, length: 'medium', allowNull: false },
  status: { type: Sequelize.INTEGER, allowNull: false },
  lat: { type: Sequelize.FLOAT, allowNull: false },
  lon: { type: Sequelize.FLOAT, allowNull: false },
  subscribed: { type: Sequelize.BOOLEAN, allowNull: true },
  image: { type: Sequelize.STRING, allowNull: true }
});

export let News = sequelize.define('news', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, length: 'medium', allowNull: false },
  status: { type: Sequelize.INTEGER, allowNull: false },
  lat: { type: Sequelize.FLOAT, allowNull: false },
  lon: { type: Sequelize.FLOAT, allowNull: false },
  companyStatus: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
});

export let Subscriptions = sequelize.define('subscriptions');
News.belongsToMany(Users, { through: Subscriptions });
Users.belongsToMany(News, { through: Subscriptions });

export let UserMunicipals = sequelize.define('usermunicipals');
Municipals.belongsToMany(Users, { through: UserMunicipals });
Users.belongsToMany(Municipals, { through: UserMunicipals });

Users.hasMany(Tickets, { foreignKey: { allowNull: false } });
Municipals.hasMany(Users, { foreignKey: { allowNull: false } });
Categories.hasMany(Categories, { foreignKey: { name: 'parentId' } });
Categories.hasMany(Tickets, { foreignKey: { allowNull: false } });
Categories.hasMany(News, { foreignKey: { allowNull: false } });
Users.hasMany(News, { foreignKey: { name: 'companyId' } });
News.hasMany(Tickets);
Municipals.hasMany(Tickets, { foreignKey: { allowNull: false } });
Municipals.hasMany(News, { foreignKey: { allowNull: false } });

let production = process.env.NODE_ENV === 'production';
export let sync = sequelize.sync({ force: production ? false : true }).then(async () => {
  if (!production) {
    await Municipals.create({
      name: 'Lindesnes'
    });
    await Municipals.create({
      name: 'Risør'
    });
    await Municipals.create({
      name: 'Kristiansand'
    });
    await Municipals.create({
      name: 'Kristiansund'
    });
    await Municipals.create({
      name: 'Rana'
    });
    await Municipals.create({
      name: 'Oslo'
    });
    await Municipals.create({
      name: 'Gramstad'
    });
    await Municipals.create({
      name: 'Vennesla'
    });
    await Municipals.create({
      name: 'Bergen'
    });
    await Municipals.create({
      name: 'Stranda'
    });
    await Categories.create({
      name: 'Vei og trafikk'
    });
    await Categories.create({
      name: 'Brøyting av snø'
    });
    await Categories.create({
      name: 'Setting av brøytestikker',
      parentId: 1
    });
    await Categories.create({
      name: 'Setting av brøytestikker 2',
      parentId: 1
    });
    await Users.create({
      name: 'Ola',
      email: 'user@user.com',
      phone: 123,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 1,
      municipalId: 1
    });
    await Users.create({
      name: 'Ola',
      email: 'employee@employee.com',
      phone: 1234,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 3,
      municipalId: 1
    });
    await Users.create({
      name: 'Ola',
      email: 'admin@admin.com',
      phone: 12345,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 4,
      municipalId: 1
    });
    await Users.create({
      name: 'SmartPark',
      email: 'company@company.com',
      phone: 12345678,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 2,
      municipalId: 1
    });
    await Tickets.create({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 4,
      lat: 1,
      lon: 1,
      categoryId: 2,
      userId: 1,
      municipalId: 1,
      image: null
    });
    await Tickets.create({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 1,
      lat: 1,
      lon: 1,
      categoryId: 2,
      userId: 1,
      municipalId: 1,
      image: null
    });
    await Tickets.create({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 3,
      lat: 1,
      lon: 1,
      categoryId: 2,
      userId: 1,
      municipalId: 1,
      image: null
    });
    await News.create({
      title: 'Problem ved vei i TRD sentrum.',
      description: 'Brøytestikker skal bli satt opp.',
      status: 1,
      lat: 1,
      lon: 1,
      categoryId: 2,
      municipalId: 1
    });
    await News.create({
      title: 'Enda en nyhet!',
      description: 'Brøytestikker skal bli satt opp.',
      status: 1,
      lat: 1,
      lon: 1,
      categoryId: 1,
      municipalId: 1
    });
    await News.create({
      title: 'En nyhet',
      description: 'Nyhet beskrivelse.',
      status: 1,
      lat: 1,
      lon: 1,
      categoryId: 1,
      municipalId: 1
    });
    await Subscriptions.create({
      newsId: 1,
      userId: 1
    });
    await Subscriptions.create({
      newsId: 2,
      userId: 1
    });
    await Subscriptions.create({
      newsId: 3,
      userId: 1
    });
    await UserMunicipals.create({
      userId: 1,
      municipalId: 1
    });
    await UserMunicipals.create({
      userId: 1,
      municipalId: 2
    });
    return true;
  }
});
