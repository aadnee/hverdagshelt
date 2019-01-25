import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { NewsFeedWidget } from './../widgets/NewsFeedWidget';
import { Container, Grid, Header, Divider, Segment } from 'semantic-ui-react';

export class StatisticsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Statistikk</Header>
        <Segment color="blue" basic>
          <Grid columns={2} centered>
            <Grid.Column width={16}>
              <Divider hidden />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
