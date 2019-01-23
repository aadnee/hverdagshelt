import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Modal, Button, Message, Container, Segment, Divider } from 'semantic-ui-react';

import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { subscriptionService } from '../services/SubscriptionServices';

import { MessageWidget } from '../widgets/MessageWidget';
import { toast } from 'react-toastify';
import { Consumer } from '../context';

export class UserSubscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      modalOpen: false,
      modalParam: ''
    };

    this.show = this.show.bind(this);
  }
  show = id => this.setState({ modalOpen: true, modalParam: id });
  close = () => this.setState({ modalOpen: false });

  componentWillMount() {
    subscriptionService.getSubscriptions().then(sub => {
      if (sub.data.length > 0) {
        this.setState({ news: sub.data });
      } else {
        console.log('Du følger ingen nyheter');
      }
    });
  }

  unsubscribe = (res, newsId) => {
    if (res.success) {
      toast.success(res.message.no, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.setState({ news: this.state.news.filter(news => news.id !== newsId), modalOpen: false });
    } else {
      toast.error(res.message.no, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  render() {
    return (
      <Consumer>
        {({ unsubscribeNews }) => (
          <Container>
            <Divider hidden />
            <Divider hidden />
            <Header as="h1">Nyheter jeg abonnerer på</Header>
            <Segment color="blue" basic>
              <Grid container centered>
                {this.state.news.length < 1 ? (
                  <Grid.Row centered>
                    <Message size={'massive'}>
                      <p>Du abonnerer ikke på noen nyheter</p>
                    </Message>
                  </Grid.Row>
                ) : null}
                {this.state.news.map(news => {
                  return (
                    <Grid.Row key={news.id}>
                      <NewsCaseWidget show={this.show.bind(this, news.id)} newscase={news} />
                    </Grid.Row>
                  );
                })}
              </Grid>
              <MessageWidget
                title={'Avmeld nyhet'}
                size={'tiny'}
                open={this.state.modalOpen}
                message="Er du sikker på at du vil avslutte abonnementet på denne nyheten?"
                customFunc={() => {
                  unsubscribeNews(this.state.modalParam).then(res => {
                    this.unsubscribe(res, this.state.modalParam);
                  });
                }}
                callback={this.close}
              />
            </Segment>
          </Container>
        )}
      </Consumer>
    );
  }
}
