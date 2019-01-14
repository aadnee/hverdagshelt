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
          id: 1,
          title: 'testnyhet',
          date: '28/09/2019',
          time: '19:20',
          imageURL:
            'http://www.sunnydalegardencentre.co.uk/files/images/news/picture-an-oak-1534331433-1534331463_n.jpg',

          description: 'nyhetsbeskrivelse' + 'yeet' + 'yeet',
          address: 'prinsengate 20',
          company: 'company name'
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
                <NewsCaseWidget news={news} />
              </Grid.Row>
            );
          })}
        </Grid>
      </div>
    );
  }
}
