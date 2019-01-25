import React from 'react';
import { Component } from 'react';
import { Segment, Container, Grid, List, Header, Image } from 'semantic-ui-react';

//import {} from './';

export class FooterWidget extends Component {
  render() {
    return (
      <Segment basic inverted fluid="true" color="black" style={{ marginTop: 0 }} padded="very">
        <Container>
          <Grid divided inverted stackable centered>
            <Grid.Row>
              <Grid.Column width={3} centered="true">
                <Image src="img/hverdagshelt_logo_hvit.png" as="a" size="medium" href="/" target="_blank" />
              </Grid.Column>
              <Grid.Column width={6} centered="true">
                <Header inverted as="h4" content="Kontakt" />
                <List link inverted>
                  <List.Item>Kommune fellessentral</List.Item>
                  <List.Item>Tlf: +47 84793991</List.Item>
                  <List.Item>Mail: kundeservice@hverdagshelt.no</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7} centered="true">
                <Header as="h4" inverted>
                  Hverdagshelt
                </Header>
                <p>
                  <i>Enklere kommunikasjon med DIN kommune</i>
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    );
  }
}
