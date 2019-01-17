import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid, Segment, Divider } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MapWidget } from '../widgets/MapWidget';
import { ticketService } from '../services/TicketServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Consumer } from '../context';

export class UserReportTicketPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latlng: [null, null],
      address: null
    };
    this.callback = this.callback.bind(this);
    this.submit = this.submit.bind(this);
  }

  callback(latlng, address) {
    this.setState({ latlng: latlng, address: address });
  }

  callbackFake() {}

  submit = (headline, description, lat, lon, address, catId, municipalId, subscribed, image) => {
    console.log(this.state);
    //lat, lon  is fetched from the map

    if (!headline || !description || !lat || !lon || !catId || !municipalId) {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      ticketService
        .addTicket(headline, description, lat, lon, address, catId, municipalId, subscribed, image)
        .then(res => {
          console.log(res);
          if (res.success) {
            toast.success(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
            Consumer._currentValue.history.push({ pathname: '/tickets' });
          } else {
            toast.error(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          console.log(res);
        });
    }
  };

  render() {
    return (
      <Container>
        <Header as="h2">Meld inn feil</Header>
        <Segment basic color="blue">
          <Grid divided>
            <Grid.Row columns={2} only="computer">
              <Grid.Column>
                <MapWidget callback={this.callback} submit={this.submit} />
              </Grid.Column>
              <Grid.Column only="computer">
                <TicketFormWidget
                  borderless
                  latlng={this.state.latlng}
                  address={this.state.address}
                  submit={this.submit}
                />
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
