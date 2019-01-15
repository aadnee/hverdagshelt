import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Modal, Button } from 'semantic-ui-react';

import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { subscriptionService } from '../services/SubscriptionServices';

export class UserSubscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      open: false,
      modalMessage: ''
    };
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  show = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  componentWillMount() {
    subscriptionService.getSubscriptions().then(sub => {
      console.log(sub.data);
      if (sub.data.length > 0) {
        this.setState({ news: sub.data });
      } else {
        console.log('Du følger ingen nyheter');
      }
    });
  }

  unsubscribe(newsId) {
    console.log(newsId);

    subscriptionService.deleteSubscription(newsId).then(res => {
      console.log(res);

      this.show();

      this.setState({ news: this.state.news.filter(news => news.id !== newsId), modalMessage: res.message.no });
    });
  }

  render() {
    const { open } = this.state;

    return (
      <div>
        <Header size={'huge'} textAlign={'center'}>
          Nyheter jeg abonnerer på
        </Header>
        <Grid container centered>
          {this.state.news.map(news => {
            return (
              <Grid.Row key={news.id}>
                <NewsCaseWidget unsubscribe={this.unsubscribe.bind(this, news.id)} newscase={news} />
              </Grid.Row>
            );
          })}
        </Grid>
        <Modal size={'tiny'} open={open} onClose={this.close}>
          <Modal.Header>Status</Modal.Header>
          <Modal.Content>
            <p>{this.state.modalMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button icon="checkmark" labelPosition="right" content="OK" onClick={this.close} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
