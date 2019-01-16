import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid, Segment, Divider } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';

export class UserReportTicketPage extends Component {
  render() {
    return (
      <Container>
        <Header as="h2">Meld inn feil</Header>
        <Segment basic color="blue">
          <Grid divided>
            <Grid.Row columns={2} only="computer">
              <Grid.Column>
                <MapWidget employee />
              </Grid.Column>
              <Grid.Column only="computer">
                <TicketFormWidget borderless />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} only="mobile tablet">
              <Grid.Column colSpan={2}>
                <MapWidget employee modal />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
