import React from 'react';
import { Component } from 'react';
import { Container, Grid, Segment, Divider } from 'semantic-ui-react';

export class PageNotFoundPage extends Component {
  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Grid centered>
          <Grid.Column>
            <h1>Siden eksisterer ikke (404)</h1>
            <Segment stacked color="blue" basic>
              <p>
                Siden du ser etter ble dessverre ikke funnet. Innholdet kan ha blitt flyttet, eller du kan ha skrevet
                inn en nettadresse som ikke eksisterer
              </p>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
