import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';
import { Container, Header, Segment, Grid, Divider } from 'semantic-ui-react';

//import {} from './../widgets';

export class AdminCompanyPage extends Component {
  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Brukere</Header>
        <Segment basic color="blue">
          <p>Litt informasjon om hvordan man endrer bedriftskontoer</p>
          <Grid divided>
            <Grid.Column>
              <UserComponentListWidget />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
