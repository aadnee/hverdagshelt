import api from './api';

class SubscriptionSevices {
  addSubscription(newsId) {
    return api.post('/api/subscription');
  }
}

export let subscriptionService = new SubscriptionSevices();
