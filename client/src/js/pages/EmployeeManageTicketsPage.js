import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Message, Reveal } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
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
      <div>
        <Header textAlign={'center'} size={'huge'}>
          Varslinger fra brukerne
        </Header>
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
      </div>
    );
  }

  reject(id) {
    console.log('Decline');
    console.log(id);
    ticketService.rejectTicket(id).then(res => {
      console.log(res);
      this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });
      console.log(this.state.tickets);
      if (this.state.tickets.length < 1) {
      }
    });
  }

  accept(id, title, description, lat, lon, categoryId, municipalId) {
    console.log('approve');
    console.log(id);
    console.log(title);

    ticketService.acceptTicket(id, title, description, lat, lon, categoryId, municipalId).then(res => {
      console.log(res);
      this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });

      if (this.state.tickets.length < 1) {
        console.log('Du har ingen varsler fra brukere');
        this.setState({ hasTickets: false });
      }
    });
  }
}
