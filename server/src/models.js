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
    }
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
  lon: { type: Sequelize.FLOAT, allowNull: false }
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
    await Categories.create({
      name: 'Vei og trafikk'
    });
    await Categories.create({
      name: 'Setting av brøytestikker',
      parentId: 1
    });
    await Users.create({
      name: 'Ola',
      email: 'test@test.com',
      phone: 123,
      password: '$2a$12$4CioQiWjDQ8Cq3d973m7m.dZE1YHTSixgwQV8Dj06xsAvOqLRELTu',
      rank: 3,
      municipalId: 1
    });
    await Users.create({
      name: 'SmartPark',
      email: 'admin@smartpark.no',
      phone: 12345678,
      password: '12345',
      rank: 2,
      municipalId: 1
    });
    await Tickets.create({
      title: 'Vei problem',
      description: 'Pls sett opp brøytestikker her.',
      status: 1,
      lat: 1,
      lon: 1,
      categoryId: 2,
      userId: 1,
      municipalId: 1
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
    await Subscriptions.create({
      newsId: 1,
      userId: 1
    });
    return true;
  }
});
