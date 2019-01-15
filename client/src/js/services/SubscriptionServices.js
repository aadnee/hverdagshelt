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
    return api.delete('api/subscriptions', {
      newsId: newsId
    });
  }
}

export let subscriptionService = new SubscriptionServices();
