import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Message, Container } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { ticketService } from '../services/TicketServices';
import { subscriptionService } from '../services/SubscriptionServices';
import Cookies from 'js-cookie';

export class EmployeeManageTicketsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      hasTickets: true
    };
    this.reject = this.reject.bind(this);
    this.accept = this.accept.bind(this);
  }

  componentWillMount() {
    //Fetch id based on user bound to municipal

    console.log(Cookies.get('municipalId'));
    ticketService.getMunicipalTickets(Cookies.get('municipalId')).then(res => {
      console.log(res);
      if (res.data.length < 1) {
        console.log('Du har ingen varsler fra brukere');
        this.setState({ hasTickets: false });
      }
      this.setState({ tickets: res.data });
    });
  }

  render() {
    return (
      <Container>
        <Header as="h2">Varslinger fra brukerne</Header>
        <Grid stackable container columns={3}>
          {!this.state.hasTickets ? (
            <Grid.Row centered>
              <Message size={'massive'}>
                <p>Du har ingen flere varsler å administrere</p>
              </Message>
            </Grid.Row>
          ) : null}
          {this.state.tickets.map(ticket => (
            <Grid.Column key={ticket.id}>
              <TicketWidget
                employee
                ticket={ticket}
                accept={this.accept.bind(this, ticket.id)}
                reject={this.reject.bind(this, ticket.id)}
              />
            </Grid.Column>
          ))}
        </Grid>
      </Container>
    );
  }

  reject(id) {
    console.log(id);
    ticketService.rejectTicket(id).then(res => {
      console.log(res);
      this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });

      if (this.state.tickets.length < 1) {
        console.log('Du har ingen varsler fra brukere');
        this.setState({ hasTickets: false });
      }
    });
  }

  accept(id, title, description, lat, lon, categoryId, municipalId) {
    ticketService.acceptTicket(id, title, description, lat, lon, categoryId, municipalId).then(res => {
      console.log(res.message.no);

      let ticket = this.state.tickets.find(t => t.id === id);
      console.log(ticket);
      if (ticket.subscribed) {
        subscriptionService.addSubscription(res.id, ticket.userId).then(res => {
          console.log(res.message.no);
        });
      }
      this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });
      if (this.state.tickets.length < 1) {
        console.log('Du har ingen varsler fra brukere');
        this.setState({ hasTickets: false });
      }
    });
  }
}
