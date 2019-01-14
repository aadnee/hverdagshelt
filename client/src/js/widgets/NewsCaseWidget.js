import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input } from 'semantic-ui-react';

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
    return (
      <Segment color="teal">
        <Container>
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <Header as="h2">{this.props.title}</Header>
              </Grid.Column>
              <Grid.Column width={4} textAlign="right">
                <p>{this.props.date}</p>
                <p>
                  <i>{this.props.time}</i>
                </p>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment vertical>
            <Container>
              <Grid divided inverted stackable>
                <Grid.Column width={4} align="right" only="mobile">
                  <Image
                    fluid
                    src={this.props.imageURL}
                    //as='a'
                    //href='http://localhost:3000/#/widget'
                    target="_blank"
                  />
                </Grid.Column>
                <Grid.Column width={12} textAlign="left">
                  <p>{this.props.description}</p>
                </Grid.Column>
                <Grid.Column width={4} align="right" only="tablet computer">
                  <Image
                    fluid
                    src={this.props.imageURL}
                    //as='a'
                    //href='http://localhost:3000/#/widget'
                    target="_blank"
                  />
                </Grid.Column>
              </Grid>
            </Container>
          </Segment>
          <List link>
            <List.Item as="a">Hendelses-adresse: {this.props.address}</List.Item>
            <List.Item as="a">Oppdrag utføres av: {this.props.company}</List.Item>
          </List>
        </Container>
      </Segment>
    );
  }
}
