import api from './api';

class SubscriptionServices {
  addSubscription(newsId) {
    return api.post('/api/subscriptions', {
      newsId: newsId
    });
  }

  getSubscriptions() {
    console.log('yyet');
    return api.get('/api/subscriptions');
  }
}

export let subscriptionService = new SubscriptionServices();
