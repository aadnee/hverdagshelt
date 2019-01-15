import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';

import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { newsService } from '../services/NewsServices';

export class UserSubscriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [
        {
          categoryId: 2,
          createdAt: '2019-01-15T07:33:32.000Z',
          description: 'Pls sett opp brøytestikker her.',
          id: 1,
          lat: 1,
          lon: 1,
          municipalId: 1,
          newsId: null,
          status: 4,
          title: 'Vei problem',
          updatedAt: '2019-01-15T07:33:32.000Z',
          userId: 1
        }
      ]
    };
  }

  componentWillMount() {}

  render() {
    return (
      <div>
        <Header size={'huge'} textAlign={'center'}>
          Nyheter jeg abonnerer på
        </Header>
        <Grid container>
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
