import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';

export class UserReportTicketPage extends Component {
  render() {
    return (
      <Container>
        <Header as="h2">Meld inn feil</Header>
        <Grid divided columns={2}>
          <Grid.Column>
            <MapWidget />
          </Grid.Column>
          <Grid.Column>
            <TicketFormWidget />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
