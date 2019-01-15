import { Subscriptions, News, Users } from '../models';

module.exports = {
  getSubscriptions: function(id, callback) {
    Subscriptions.findAll({
      attributes: ['newsId'],
      where: { userId: id },
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
  },

  addSubscription: function(newsId, id, callback) {
    Subscriptions.create({
      newsId: newsId,
      userId: id
    }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Subscription added.', no: 'Abonnement har blitt lagt til.' },
          id: result.id
        }),
      err => callback({ success: false, message: err })
    );
  },

  deleteSubscription: function(newsId, id, callback) {
    Subscriptions.destroy({
      where: {
        newsId: newsId,
        userId: id
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
