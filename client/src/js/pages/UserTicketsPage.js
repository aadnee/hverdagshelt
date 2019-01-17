import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { TicketFormWidget } from '../widgets/TicketFormWidget';

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      showEditTicket: false,
      editTicket: null,
      tickets: []
    };
  }

  close = () => {
    this.setState({ showEditTicket: false });
  };

  show = ticketEdit => {
    this.setState({ showEditTicket: true, editTicket: ticketEdit });
  };

  componentWillMount() {
    ticketService.getTickets().then(res => {
      console.log(res);
      this.setState({ tickets: res.data });
    });
  }

  handleEdit = newTicket => {
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
                <TicketWidget show={this.show.bind(this, ticket)} ticket={ticket} />
              </Grid.Column>
            ))}
          </Grid>
        </Container>
        <Modal open={this.state.showEditTicket}>
          <TicketFormWidget ticket={this.state.editTicket} submitButton={'Lagre endringer'} />
        </Modal>
      </div>
    );
  }
}
