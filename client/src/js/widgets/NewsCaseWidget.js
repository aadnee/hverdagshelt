import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button } from 'semantic-ui-react';

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
    let { newscase } = this.props;
    newscase.imageURL = null;
    console.log(newscase);
    const date = newscase.createdAt.split('T')[0].split('-');
    const clock = newscase.createdAt.split('T')[1].split('.')[0];

    return (
      <Segment color="teal">
        <Container>
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <Header as="h2">{newscase.title}</Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <p>{date[2] + ' / ' + date[1] + ' / ' + date[0]}</p>
                <p>
                  <i>{clock}</i>
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
                    <Image
                      fluid
                      src={newscase.imageURL}
                      //as='a'
                      //href='http://localhost:3000/#/widget'
                      target="_blank"
                    />
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

          <Button onClick={this.props.unsubscribe}>Avslutt abonnement</Button>
        </Container>
      </Segment>
    );
  }
}
