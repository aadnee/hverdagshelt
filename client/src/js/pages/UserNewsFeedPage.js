import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { NewsFeedWidget } from './../widgets/NewsFeedWidget';
import { Container, Grid, Header, Divider } from 'semantic-ui-react';

export class UserNewsFeedPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Grid columns={2} centered>
          <Grid.Column width={16}>
            <Header as="h1">Nyhetsstrøm</Header>
            <NewsFeedWidget />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
