import Sequelize from 'sequelize';

let sequelize = new Sequelize('School', 'root', '', {
  host: process.env.CI ? 'mysql' : 'localhost', // The host is 'mysql' when running in gitlab CI
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
  email: Sequelize.STRING,
  phone: Sequelize.INTEGER,
  password: Sequelize.STRING,
  rank: Sequelize.INTEGER
});

export let CompanyUsers = sequelize.define('companyUsers', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  phone: Sequelize.INTEGER,
  password: Sequelize.STRING
});

export let Municipals = sequelize.define('municipal', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: Sequelize.STRING,
  postalCode: Sequelize.INTEGER
});

Users.belongsTo(Municipals);
CompanyUsers.belongsTo(Municipals);

// Drop tables and create test data when not in production environment
let production = process.env.NODE_ENV === 'production';
// The sync promise can be used to wait for the database to be ready (for instance in your tests)
export let sync = sequelize.sync({ force: production ? false : true }).then(() => {
  if (!production)
    return Users.create({
      firstName: 'Ola',
      lastName: 'Jensen',
      email: 'ola.jensen@ntnu.no',
      phone: 123,
      password: '123',
      rank: 3
    }).then(() =>
      Users.create({
        firstName: 'Kari',
        lastName: 'Larsen',
        email: 'kari.larsen@ntnu.no',
        phone: 123,
        password: '12345',
        rank: 1
      })
    );
});
