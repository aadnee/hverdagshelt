import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { TicketFormWidget } from '../widgets/TicketFormWidget';

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditTicket: false,
      tickets: []
    };
  }

  componentWillMount() {
    ticketService.getTickets().then(res => {
      console.log(res);
      this.setState({ tickets: res.data });
    });
  }

  handleEdit = () => {
    ticketService.UpdateTicket();
  };

  render() {
    return (
      <div>
        <Container>
          <Header as="h2">Mine varslinger</Header>
          <Grid stackable container columns={3}>
            {this.state.tickets.map(ticket => (
              <Grid.Column key={ticket.id}>
                <TicketWidget ticket={ticket} />
              </Grid.Column>
            ))}
          </Grid>
        </Container>
        <modal open={this.state.showEditTicket}>
          <TicketFormWidget submitButton={'Lagre endringer'} />
        </modal>
      </div>
    );
  }
}
