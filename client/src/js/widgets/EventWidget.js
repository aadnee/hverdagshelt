import React from 'react';
import { Component } from 'react';
import { Divider, Segment, Container, Grid, List, Header, Image, Form, Input, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { ShowInMapWidget } from './ShowInMapWidget';

export class EventWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderMap: false
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ renderMap: false });
  }

  render() {
    const event = this.props.event;
    const dateInfo = Consumer._currentValue.convDbString(event.createdAt);

    return (
      <Segment color="pink" fluid="true">
        <Container>
          <Header as="h2">{event.title}</Header>
          <p>{dateInfo}</p>
          <Divider />
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={12} textAlign="left">
                <p>{event.description}</p>
              </Grid.Column>
              <Grid.Column width={4} align="right" only="tablet computer">
                <ShowInMapWidget latlng={event.area} mapOnly />
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment basic>
            <Grid stackable>
              Hendelses-adresse: {event.address},
              <ShowInMapWidget
                draggable
                callback={this.close}
                renderMap={this.state.renderMap}
                button={
                  <span className="showInMap" onClick={() => this.setState({ renderMap: true })}>
                    vis i kart
                  </span>
                }
                latlng={event.area}
              />
            </Grid>
          </Segment>
          <Button onClick={this.props.show}>Avslutt abonnement</Button>
        </Container>
      </Segment>
    );
  }
}
