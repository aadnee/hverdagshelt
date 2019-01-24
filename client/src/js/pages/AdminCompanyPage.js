import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';
import { Container, Header, Segment, Grid, Divider, Input } from 'semantic-ui-react';

//import {} from './../widgets';

export class AdminCompanyPage extends Component {
  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Bedrifter</Header>
        <Segment basic color="blue">
          <p>Her kan du administrere bedrifter. Trykk på den grønne plussen for å legge til en ny bedrift</p>
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
