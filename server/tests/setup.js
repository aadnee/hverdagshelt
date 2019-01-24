import {
  sequelize,
  Municipals,
  Categories,
  Events,
  Users,
  Subscriptions,
  Tickets,
  News,
  UserMunicipals,
  Uploads
} from '../src/models';

beforeAll(async done => {
  await sequelize.sync({ force: true }).then(async () => {
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
    await Categories.create({
      name: 'Setting av underkat 2',
      parentId: 2
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
      categoryId: 4,
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
      categoryId: 3,
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
      categoryId: 3,
      userId: 1,
      municipalId: 1,
      subscribed: true
    });
    await News.create({
      title: 'Problem ved vei i TRD sentrum.',
      description: 'Brøytestikker skal bli satt opp.',
      status: 2,
      lat: 1,
      lon: 1,
      address: 'Test street',
      categoryId: 3,
      municipalId: 1
    });
    await News.create({
      title: 'Enda en nyhet!',
      description: 'Brøytestikker skal bli satt opp.',
      status: 2,
      lat: 1,
      lon: 1,
      address: 'Test street',
      categoryId: 3,
      municipalId: 1
    });
    await News.create({
      title: 'En nyhet',
      description: 'Nyhet beskrivelse.',
      status: 2,
      lat: 1,
      lon: 1,
      address: 'Test street',
      categoryId: 4,
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
        '[{“lat”:63.43201612964023,“lng”:10.407967632807194},{“lat”:63.43090857520207,“lng”:10.40639117486217},{“lat”:63.43048129510122,“lng”:10.405108908398882},{“lat”:63.42946152566984,“lng”:10.403993069095725},{“lat”:63.42806794456033,“lng”:10.403021440771646},{“lat”:63.42797195972445,“lng”:10.405984788670711},{“lat”:63.42945968855248,“lng”:10.406176606337663},{“lat”:63.43100492510339,“lng”:10.410233922250184},{“lat”:63.43183029681879,“lng”:10.408772207870129}]',
      address: 'Nedre Bakklandet 47E, Trondheim',
      start: '2019-01-23',
      end: '2019-01-23',
      municipalId: 2
    });
    await Events.create({
      title: 'Taco buffet LINDESNES',
      description: 'Deilig taco buffet med ost og lefser på TRD 2',
      area:
        '[{“lat”:63.424683535045446,“lng”:10.39519226433361},{“lat”:63.42463073719075,“lng”:10.397456906242011},{“lat”:63.42503340721621,“lng”:10.399053142186434},{“lat”:63.42570708187656,“lng”:10.400175994767707},{“lat”:63.42598879567531,“lng”:10.399205772923603},{“lat”:63.42574627700572,“lng”:10.398736228606696},{“lat”:63.42555764995496,“lng”:10.39755742223462},{“lat”:63.4257511763931,“lng”:10.397339785828082},{“lat”:63.42569483338774,“lng”:10.395958357428173},{“lat”:63.42555764995496,“lng”:10.394824957194345},{“lat”:63.42537392111464,“lng”:10.394781662131292},{“lat”:63.42524408535718,“lng”:10.395263790515987}]',
      address: 'Kongsgårdsgata, Trondheim',
      start: '2019-02-29',
      end: '2019-02-29',
      municipalId: 2
    });
    done();
  });
});
