import { Subscriptions, News, Users, Municipals } from '../models';

module.exports = {
  getSubscriptions: function(userId, callback) {
    Subscriptions.findAll({
      attributes: ['newsId'],
      where: { userId: userId },
      raw: true
    }).then(res => {
      News.findAll({
        where: { id: res.map(item => item.newsId) }
      }).then(
        res =>
          callback({
            success: true,
            data: res
          }),
        err => callback({ success: false, message: err })
      );
    }),
      err => callback({ success: false, message: err });
    // Users.findOne({
    //   include: [
    //     {
    //       model: News,
    //       required: false,
    //       through: { model: Subscriptions }
    //     }
    //   ],
    //   where: { id: userId }
    // }).then(
    //   res =>
    //     callback({
    //       success: true,
    //       data: res
    //     }),
    //   err => callback({ success: false, message: err })
    // );
  },

  addSubscription: function(newsId, userId, callback) {
    Subscriptions.create({
      newsId: newsId,
      userId: userId
    }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Subscription added.', no: 'Abonnement har blitt lagt til.' }
        }),
      err => callback({ success: false, message: err })
    );
  },

  deleteSubscription: function(newsId, userId, callback) {
    Subscriptions.destroy({
      where: {
        newsId: newsId,
        userId: userId
      }
    }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Subscription deleted.', no: 'Abonnement har blitt fjernet.' }
        }),
      err => callback({ success: false, message: err })
    );
  }
};
