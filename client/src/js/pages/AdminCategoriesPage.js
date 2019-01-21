import React from 'react';
import { Component } from 'react';
import { Grid, Container, Divider, Header, Segment, Button } from 'semantic-ui-react';
import { AdminCategoriesWidget } from '../widgets/AdminCategoriesWidget';

//import {} from './../widgets';

export class AdminCategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.selectedCat = this.selectedCat.bind(this);
    this.state = {
      selectedCategory: '',
      categories: []
    };
  }

  selectedCat = selCat => {
    this.setState({ selectedCategory: selCat });
    console.log('rtvr');
  };

  render() {
    return (
      <Container>
        <Header as="h2">Administrer kategorier</Header>
        <Segment basic color="blue">
          <Button.Group floated="right">
            <Button positive content="Rediger" />
            <Button negative content="Slett" />
          </Button.Group>
          <p>Litt informasjon om hvordan man endrer kategorier</p>
          <Grid divided>
            <Grid.Column>
              <AdminCategoriesWidget func={this.selectedCat} />
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
