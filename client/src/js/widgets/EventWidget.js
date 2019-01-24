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
    this.setState({ renderMap: false, openMap: false });
  }

  render() {
    const event = this.props.event;
    const area = JSON.parse(event.area).map(cord => {
      return [cord.lat, cord.lng];
    });
    const dateInfo = Consumer._currentValue.convDbString(event.createdAt);

    return (
      <Segment color="pink" fluid="true">
        <Container>
          <Header as="h2">{event.title}</Header>
          <p>{dateInfo}</p>
          <Divider />
          <Segment vertical>
            <Grid divided inverted stackable>
              <Grid.Column width={8} textAlign="left">
                <p>{event.description}</p>
              </Grid.Column>
              <Grid.Column width={8} align="right" only="tablet computer">
                <span onClick={() => this.setState({ renderMap: true, openMap: true })}>
                  <ShowInMapWidget latlng={area} mapOnly pointer />
                </span>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment basic>
            <Grid stackable>
              Hendelses-adresse: {event.address},
              <span className="showInMap" onClick={() => this.setState({ renderMap: true, openMap: true })}>
                vis i kart
              </span>
              <ShowInMapWidget
                draggable
                open={this.state.openMap}
                callback={this.close}
                renderMap={this.state.renderMap}
                latlng={area}
              />
            </Grid>
          </Segment>
        </Container>
      </Segment>
    );
  }
}
