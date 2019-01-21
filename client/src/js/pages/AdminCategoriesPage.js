import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Container, Divider, Header, Segment } from 'semantic-ui-react';
import { NewsFeedWidget } from '../widgets/NewsFeedWidget';
import { AdminCategoriesWidget } from '../widgets/AdminCategoriesWidget';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';

//import {} from './../widgets';

export class AdminCategoriesPage extends Component {
  render() {
    return (
      <Container>
        <Header as="h2">Administrer kategorier</Header>
        <Segment basic color="blue">
          <p>Litt informasjon om hvordan man endrer kategorier</p>
          <Grid divided>
            <Grid.Column>
              <AdminCategoriesWidget />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
