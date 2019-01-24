import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';
import { Container, Header, Segment, Grid, Divider } from 'semantic-ui-react';

//import {} from './../widgets';

export class AdminUsersPage extends Component {
  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Brukere</Header>
        <Segment basic color="blue">
          <p>Her kan du administrer brukere. Trykk på den grønne plussen for å legge til en ny bruker</p>
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
