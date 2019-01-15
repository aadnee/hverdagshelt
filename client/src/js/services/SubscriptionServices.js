import api from './api';

class SubscriptionServices {
  addSubscription(newsId) {
    return api.post('/api/subscriptions', {
      newsId: newsId
    });
  }

  getSubscriptions() {
    return api.get('/api/subscriptions');
  }

  deleteSubscription(newsId) {
    console.log(newsId);
    return api.delete('/api/subscriptions', {
      data: {
        newsId: newsId
      }
    });
  }
}

export let subscriptionService = new SubscriptionServices();
