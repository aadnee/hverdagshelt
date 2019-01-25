import React from 'react';
import { Component } from 'react';
import {
  Divider,
  Segment,
  Container,
  Grid,
  List,
  Header,
  Image,
  Form,
  Input,
  Button,
  Card,
  Icon
} from 'semantic-ui-react';
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
    const dateInfoFrom = Consumer._currentValue.convDbString(event.start, true);
    const dateInfoTo = Consumer._currentValue.convDbString(event.end, true);

    return (
      <Card fluid color="purple">
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={8}>
              <Container style={{ padding: 14 }}>
                <Card.Header as="h3">{event.title}</Card.Header>
                <Card.Meta>
                  <Icon name="calendar outline" />
                  {dateInfoFrom[0]} - {dateInfoTo[0]}
                  <br />
                  <Icon name="clock outline" />
                  {dateInfoFrom[1]} - {dateInfoTo[1]}
                  <br />
                  <Icon name="point" />
                  {event.address}
                  {event.url ? (
                    event.url.split('s:')[0] === 'http' ? (
                      <>
                        <br />
                        <Icon name="linkify" />
                        <a href={event.url}>{event.url.split('/')[2]}</a>
                      </>
                    ) : null
                  ) : null}
                </Card.Meta>
              </Container>
              <Card.Content style={{ padding: 14, borderTop: 0 }}>
                <Card.Description>
                  {event.description.split('\n').map(p => (
                    <p key={p}>{p}</p>
                  ))}
                </Card.Description>
              </Card.Content>
            </Grid.Column>

            <Grid.Column width={8} style={{ width: '100%', height: '100%' }}>
              <Image style={{ width: '100%', height: '100%' }}>
                <span onClick={() => this.setState({ renderMap: true, openMap: true })}>
                  <ShowInMapWidget latlng={area} newsMapOnly pointer event />
                </span>
              </Image>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <ShowInMapWidget
          draggable
          open={this.state.openMap}
          latlng={area}
          renderMap={this.state.renderMap}
          callback={this.close}
          event
        />
      </Card>
    );
  }
}
