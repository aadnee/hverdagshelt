import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { EventFeedWidget } from './../widgets/EventFeedWidget';
import { Container, Grid, Header, Divider, Segment } from 'semantic-ui-react';

export class UserEventFeedPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Arrangementer</Header>
        <Segment color="blue" basic>
          <Grid columns={2} centered>
            <Grid.Column width={16}>
              <Divider hidden />
              <EventFeedWidget />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
