import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import Cookies from 'js-cookie';

export class EmployeeManageTicketsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: []
    };
    this.reject = this.reject.bind(this);
    this.approve = this.approve.bind(this);
  }

  componentWillMount() {
    //Fetch id based on user bound to municipal

    console.log(Cookies.get('municipalId'));
    ticketService.getTickets(Cookies.get('municipalId')).then(res => {
      console.log(res);
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
          {this.state.tickets.map(ticket => (
            <Grid.Column key={ticket.id}>
              <TicketWidget
                employee
                ticket={ticket}
                reject={this.reject.bind(this, ticket.id)}
                approve={this.approve.bind(this, ticket.id)}
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
    });
  }
  approve(id, i) {
    console.log('approve');
  }
}
