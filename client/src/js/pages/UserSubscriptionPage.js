import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';

import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { subscriptionService } from '../services/SubscriptionServices';

export class UserSubscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  componentWillMount() {
    subscriptionService.getSubscriptions().then(sub => {
      console.log(sub.length);
      if (sub.length > 0) {
        this.setState({ news: sub });
      } else {
        console.log('Du følger ingen nyheter');
      }
    });
  }

  render() {
    return (
      <div>
        <Header size={'huge'} textAlign={'center'}>
          Nyheter jeg abonnerer på
        </Header>
        <Grid container centered>
          {this.state.news.map(news => {
            return (
              <Grid.Row key={news.id}>
                <NewsCaseWidget newscase={news} />
              </Grid.Row>
            );
          })}
        </Grid>
      </div>
    );
  }
}
