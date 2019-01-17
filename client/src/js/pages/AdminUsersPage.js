import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';
import { Container, Header, Segment, Grid } from 'semantic-ui-react';

//import {} from './../widgets';

export class AdminUsersPage extends Component {
  render() {
    return (
      <Container>
        <Header as="h2">Brukere</Header>
        <Segment basic color="blue">
          <p>Litt informasjon om hvordan man endrer brukere</p>
          <Grid divided>
            <Grid.Column>
              <UserComponentListWidget usertype />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
