import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const Op = Sequelize.Op;
export let sequelize = new Sequelize(
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
      $not: Op.ne,
      $gte: Op.gte
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
  reset: { type: Sequelize.STRING, allowNull: true },
  rank: { type: Sequelize.INTEGER, allowNull: false },
  notifications: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
});

export let Municipals = sequelize.define('municipals', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, unique: true, allowNull: false }
});

export let Categories = sequelize.define('categories', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
});

export let Tickets = sequelize.define('tickets', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, length: 'medium', allowNull: false },
  status: { type: Sequelize.INTEGER, allowNull: false },
  lat: { type: Sequelize.FLOAT, allowNull: false },
  lon: { type: Sequelize.FLOAT, allowNull: false },
  address: { type: Sequelize.STRING },
  subscribed: { type: Sequelize.BOOLEAN, allowNull: true }
});

export let Uploads = sequelize.define('uploads', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  filename: { type: Sequelize.STRING, allowNull: false }
});

export let News = sequelize.define('news', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, length: 'medium', allowNull: false },
  status: { type: Sequelize.INTEGER, allowNull: false },
  lat: { type: Sequelize.FLOAT, allowNull: false },
  lon: { type: Sequelize.FLOAT, allowNull: false },
  address: { type: Sequelize.STRING },
  companyStatus: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 }
});

export let Events = sequelize.define('events', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT, length: 'medium', allowNull: false },
  area: { type: Sequelize.TEXT, allowNull: false },
  address: { type: Sequelize.STRING, allowNull: false },
  start: { type: Sequelize.DATE, allowNull: false },
  end: { type: Sequelize.DATE, allowNull: false },
  url: { type: Sequelize.STRING, allowNull: true },
  active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
});

export let Subscriptions = sequelize.define('subscriptions');
News.belongsToMany(Users, { through: Subscriptions });
Users.belongsToMany(News, { through: Subscriptions });

export let UserMunicipals = sequelize.define('usermunicipals');
Municipals.belongsToMany(Users, { through: UserMunicipals });
Users.belongsToMany(Municipals, { through: UserMunicipals });

Users.hasMany(Tickets, { foreignKey: { allowNull: false } });
Tickets.belongsTo(Users, { foreignKey: { allowNull: false } });

Municipals.hasMany(Users, { foreignKey: { allowNull: false } });
Users.belongsTo(Municipals, { foreignKey: { allowNull: false } });

Categories.hasMany(Categories, { foreignKey: { name: 'parentId' }, as: 'subs' });
Categories.belongsTo(Categories, { foreignKey: { name: 'parentId' } });

Categories.hasMany(Tickets, { foreignKey: { allowNull: false } });
Tickets.belongsTo(Categories, { foreignKey: { allowNull: false } });

Categories.hasMany(News, { foreignKey: { allowNull: false } });
News.belongsTo(Categories, { foreignKey: { allowNull: false } });

Users.hasMany(News, { foreignKey: { name: 'companyId' } });
News.belongsTo(Users, { foreignKey: { name: 'companyId' } });

News.hasMany(Tickets);
Tickets.belongsTo(News);

Tickets.hasMany(Uploads);
Uploads.belongsTo(Tickets);

News.hasMany(Uploads);
Uploads.belongsTo(News);

Municipals.hasMany(Tickets, { foreignKey: { allowNull: false } });
Tickets.belongsTo(Municipals, { foreignKey: { allowNull: false } });

Municipals.hasMany(News, { foreignKey: { allowNull: false } });
News.belongsTo(Municipals, { foreignKey: { allowNull: false } });

Municipals.hasMany(Events, { foreignKey: { allowNull: false } });
Events.belongsTo(Municipals, { foreignKey: { allowNull: false } });

export function syncDatabase(callback) {
  let production = process.env.NODE_ENV === 'production';
  sequelize.sync({ force: production ? false : true }).then(async () => {
    if (!production) {
      await Municipals.create({
        name: 'Trondheim'
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
        name: 'Grumstad'
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
        name: 'Skog og utmark'
      });
      await Categories.create({
        name: 'Avfall'
      });
      await Categories.create({
        name: 'Park'
      });
      await Categories.create({
        name: 'Gatelys'
      });
      await Categories.create({
        name: 'Vann og avløp'
      });
      await Categories.create({
        name: 'Setting av brøytestikker',
        parentId: 1
      });
      await Categories.create({
        name: 'Brøyting',
        parentId: 1
      });
      await Categories.create({
        name: 'Strøing',
        parentId: 1
      });
      await Categories.create({
        name: 'Hull i veien',
        parentId: 1
      });
      await Categories.create({
        name: 'Overvann',
        parentId: 1
      });
      await Categories.create({
        name: 'Skilt',
        parentId: 1
      });
      await Categories.create({
        name: 'Gjerde/autovern',
        parentId: 1
      });
      await Categories.create({
        name: 'Oljesøl',
        parentId: 1
      });
      await Categories.create({
        name: 'Veimerking',
        parentId: 1
      });
      await Categories.create({
        name: 'Kumlokk',
        parentId: 1
      });
      await Categories.create({
        name: 'Ulykke',
        parentId: 1
      });
      await Categories.create({
        name: 'Annet (skiv i beskrivelse)',
        parentId: 1
      });
      await Categories.create({
        name: 'Skadet tre',
        parentId: 2
      });
      await Categories.create({
        name: 'Ulovlig trefelling',
        parentId: 2
      });
      await Categories.create({
        name: 'Avfall',
        parentId: 2
      });
      await Categories.create({
        name: 'Feil/mangler ved merking',
        parentId: 2
      });
      await Categories.create({
        name: 'Hærverk',
        parentId: 2
      });
      await Categories.create({
        name: 'Annet (skriv i beskrivelse)',
        parentId: 2
      });
      await Categories.create({
        name: 'Avfall i veg',
        parentId: 3
      });
      await Categories.create({
        name: 'Avfall i skog/utmark',
        parentId: 3
      });
      await Categories.create({
        name: 'Full container',
        parentId: 3
      });
      await Categories.create({
        name: 'Skadet container',
        parentId: 3
      });
      await Categories.create({
        name: 'Annet (skriv i beskrivelse)',
        parentId: 3
      });
      await Categories.create({
        name: 'Skadet tre',
        parentId: 4
      });
      await Categories.create({
        name: 'Ulovlig trefelling',
        parentId: 4
      });
      await Categories.create({
        name: 'Mørke lyspunkt',
        parentId: 4
      });
      await Categories.create({
        name: 'Feil/manglende sklting',
        parentId: 4
      });
      await Categories.create({
        name: 'Annet (skriv i beskrivelse)',
        parentId: 4
      });
      await Categories.create({
        name: 'Virker ikke',
        parentId: 5
      });
      await Categories.create({
        name: 'Veltet',
        parentId: 5
      });
      await Categories.create({
        name: 'Skadet',
        parentId: 5
      });
      await Categories.create({
        name: 'Skaper fare for andre',
        parentId: 5
      });
      await Categories.create({
        name: 'Lydstøy',
        parentId: 5
      });
      await Categories.create({
        name: 'Annet (skriv i beskrivelse)',
        parentId: 5
      });
      await Categories.create({
        name: 'Partikler og grums',
        parentId: 6
      });
      await Categories.create({
        name: 'Trykkproblemer',
        parentId: 6
      });
      await Categories.create({
        name: 'Vannlekaskje',
        parentId: 6
      });
      await Categories.create({
        name: 'Hydrant',
        parentId: 6
      });
      await Categories.create({
        name: 'Vann i hage/på plen',
        parentId: 6
      });
      await Categories.create({
        name: 'Redusert kvalitet (lukt/smak)',
        parentId: 6
      });
      await Categories.create({
        name: 'Redusert kvalitet (farge)',
        parentId: 6
      });
      await Categories.create({
        name: 'Redusert kvalitet (annet skriv i beskrivelse)',
        parentId: 6
      });
      await Categories.create({
        name: 'Kloakk',
        parentId: 6
      });
      await Categories.create({
        name: 'Septiktank',
        parentId: 6
      });
      await Categories.create({
        name: 'Olje-/kjemikalielukt',
        parentId: 6
      });
      await Categories.create({
        name: 'Vann i vei/terreng',
        parentId: 6
      });
      await Categories.create({
        name: 'Tett rist/bekkeinntak',
        parentId: 6
      });
      await Categories.create({
        name: 'Rotter',
        parentId: 6
      });
      await Categories.create({
        name: 'Annet (skriv i beskrivelse)',
        parentId: 6
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
        address: 'Test street',
        categoryId: 7,
        userId: 1,
        municipalId: 1,
        subscribed: true
      });
      await Tickets.create({
        title: 'Vei problem',
        description: 'Pls sett opp brøytestikker her.',
        status: 1,
        lat: 1,
        lon: 1,
        address: 'Test street',
        categoryId: 8,
        userId: 1,
        municipalId: 1,
        subscribed: true
      });
      await Tickets.create({
        title: 'Vei problem',
        description: 'Pls sett opp brøytestikker her.',
        status: 3,
        lat: 1,
        lon: 1,
        address: 'Test street',
        categoryId: 7,
        userId: 1,
        municipalId: 1,
        subscribed: true
      });
      await News.create({
        title: 'Problem ved vei i TRD sentrum.',
        description: 'Brøytestikker skal bli satt opp.',
        status: 3,
        lat: 1,
        lon: 1,
        address: 'Test street',
        categoryId: 7,
        municipalId: 1
      });
      await News.create({
        title: 'Enda en nyhet!',
        description: 'Brøytestikker skal bli satt opp.',
        status: 2,
        lat: 1,
        lon: 1,
        address: 'Test street',
        categoryId: 8,
        municipalId: 1
      });
      await News.create({
        title: 'En nyhet',
        description: 'Nyhet beskrivelse.',
        status: 2,
        lat: 1,
        lon: 1,
        address: 'Test street',
        categoryId: 7,
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
        userId: 2,
        municipalId: 1
      });
      await UserMunicipals.create({
        userId: 3,
        municipalId: 1
      });
      await Uploads.create({
        filename: '123.png',
        ticketId: 1
      });
      await Uploads.create({
        filename: '123.png',
        ticketId: 1
      });
      await Uploads.create({
        filename: '123.png',
        ticketId: 2
      });
      await Events.create({
        title: 'Taco buffet',
        description: 'Deilig taco buffet med ost og lefser',
        area:
          '[{"lat":63.43201612964023,"lng":10.407967632807194},{"lat":63.43090857520207,"lng":10.40639117486217},{"lat":63.43048129510122,"lng":10.405108908398882},{"lat":63.42946152566984,"lng":10.403993069095725},{"lat":63.42806794456033,"lng":10.403021440771646},{"lat":63.42797195972445,"lng":10.405984788670711},{"lat":63.42945968855248,"lng":10.406176606337663},{"lat":63.43100492510339,"lng":10.410233922250184},{"lat":63.43183029681879,"lng":10.408772207870129}]',
        address: 'Nedre Bakklandet 47E, Trondheim',
        start: '2019-01-23',
        end: '2019-01-23',
        municipalId: 2
      });
      await Events.create({
        title: 'Taco buffet LINDESNES',
        description: 'Deilig taco buffet med ost og lefser på TRD 2',
        area:
          '[{"lat":63.424683535045446,"lng":10.39519226433361},{"lat":63.42463073719075,"lng":10.397456906242011},{"lat":63.42503340721621,"lng":10.399053142186434},{"lat":63.42570708187656,"lng":10.400175994767707},{"lat":63.42598879567531,"lng":10.399205772923603},{"lat":63.42574627700572,"lng":10.398736228606696},{"lat":63.42555764995496,"lng":10.39755742223462},{"lat":63.4257511763931,"lng":10.397339785828082},{"lat":63.42569483338774,"lng":10.395958357428173},{"lat":63.42555764995496,"lng":10.394824957194345},{"lat":63.42537392111464,"lng":10.394781662131292},{"lat":63.42524408535718,"lng":10.395263790515987}]',
        address: 'Kongsgårdsgata, Trondheim',
        start: '2019-02-29',
        end: '2019-02-29',
        municipalId: 2
      });
      callback('Database synced.');
    }
  });
}
