import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Container, Grid } from 'semantic-ui-react';
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
      modalOpen: false,
      modalMessage: ''
    };
    this.submit = this.submit.bind(this);
  }

  submit = (headline, description, lat, lon, catId, municipalId, subscribed, image) => {
    console.log(this.state);
    //lat, lon  is fetched from the map
    if (!headline || !description || !lat || !lon || !catId || !municipalId) {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
      console.log('cs');
    } else {
      ticketService.addTicket(headline, description, lat, lon, catId, municipalId, subscribed, image).then(res => {
        this.setState({ modalMessage: res.message.no, modalOpen: true });
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
        <Grid divided columns={2}>
          <Grid.Column>
            <MapWidget />
          </Grid.Column>
          <Grid.Column>
            <TicketFormWidget submit={this.submit.bind(this)} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
