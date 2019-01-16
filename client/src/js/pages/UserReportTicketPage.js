import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid, Segment, Divider } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';

export class UserReportTicketPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latlng: [null, null],
      address: null
    };
    this.callback = this.callback.bind(this);
  }

  callback(latlng, address) {
    this.setState({ latlng: latlng, address: address });
  }

  callbackFake() {}

  render() {
    return (
      <Container>
        <Header as="h2">Meld inn feil</Header>
        <Segment basic color="blue">
          <Grid divided>
            <Grid.Row columns={2} only="computer">
              <Grid.Column>
                <MapWidget callback={this.callback} />
              </Grid.Column>
              <Grid.Column only="computer">
                <TicketFormWidget borderless latlng={this.state.latlng} address={this.state.address} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={1} only="mobile tablet">
              <Grid.Column colSpan={2}>
                <MapWidget modal callback={this.callbackFake} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
