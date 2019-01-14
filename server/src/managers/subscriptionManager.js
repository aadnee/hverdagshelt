import { Subscriptions, News, Users } from '../models';

module.exports = {
  getSubscriptions: function(id, callback) {
    Subscriptions.findAll({
      attributes: ['newsId'],
      where: { userId: id },
      raw: true
    }).then(res => {
      console.log(res.map(item => item.newsId));
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
  }
};
