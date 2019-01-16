import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';

export class UserReportTicketPage extends Component {
  constructor(props){
    super(props);
    this.state={
      latlng: [null,null],
      address: null
    };
    this.callback = this.callback.bind(this);
  }

  callback(latlng, address) {
    this.setState({latlng: latlng, address: address});
  }
  render() {
    return (
      <Container>
        <Header as="h2">Meld inn feil</Header>
        <Grid divided columns={2}>
          <Grid.Column>
            <MapWidget callback={this.callback}/>
          </Grid.Column>
          <Grid.Column>
            <TicketFormWidget latlng={this.state.latlng} address={this.state.address}/>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
