import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button } from 'semantic-ui-react';
import { Consumer } from './../context';

//import {} from './';

/*
 *
 *
 */

export class NewsCaseWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const newscase = this.props.newscase;
    const dateInfo = Consumer._currentValue.convDbString(newscase.createdAt);
    return (
      <Segment color="blue" fluid="true">
        <Container>
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <Header as="h2">{newscase.title}</Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <p>{dateInfo[0]}</p>
                <p>
                  <i>{dateInfo[1]}</i>
                </p>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment vertical>
            <Container>
              <Grid divided inverted stackable>
                <Grid.Column width={12} textAlign="left">
                  <p>{newscase.description}</p>
                </Grid.Column>
                {newscase.imageURL ? (
                  <Grid.Column width={4} align="right" only="tablet computer">
                    <Image fluid src={newscase.imageURL} target="_blank" />
                  </Grid.Column>
                ) : null}
              </Grid>
            </Container>
          </Segment>
          <List link>
            <List.Item as="a">
              <List.Content floated={'left'}>Hendelses-adresse: {newscase.address}</List.Content>
            </List.Item>
            <List.Item as="a">
              <List.Content floated={'left'}>Oppdrag utføres av: {newscase.company}</List.Content>
            </List.Item>
          </List>

          <Button onClick={this.props.show}>Avslutt abonnement</Button>
        </Container>
      </Segment>
    );
  }
}
