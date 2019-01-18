import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal, Segment } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { toast } from 'react-toastify';

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      showEditTicket: false,
      editTicket: null,
      tickets: [],
      messageOpen: false,
      selectedTicket: ''
    };
  }

  //Show/close functions for edit modal
  close = () => {
    this.setState({ showEditTicket: false });
  };

  show = ticketEdit => {
    this.setState({ showEditTicket: true, editTicket: ticketEdit });
  };

  //show/close for deletemessage
  closeMessage = () => {
    this.setState({ messageOpen: false });
  };

  showMessage = id => {
    this.setState({ messageOpen: true, selectedTicket: id });
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

  deleteTicket(id) {
    console.log(id);
    if (!id) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    ticketService.deleteTicket(id).then(res => {
      if (res.success) {
        toast.success(res.message.no, {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        toast.error(res.message.no, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Container>
          <Header as="h2">Mine varslinger</Header>
          <Segment basic color="blue">
            <Grid stackable container columns={3}>
              {this.state.tickets.map(ticket => (
                <Grid.Column key={ticket.id}>
                  <TicketWidget ticket={ticket} showMessage={this.showMessage.bind(this, ticket.id)} />
                </Grid.Column>
              ))}
            </Grid>
          </Segment>
        </Container>
        <Modal open={this.state.showEditTicket}>
          <TicketFormWidget submitButton={'Lagre endringer'} />
        </Modal>
        <MessageWidget
          size={'tiny'}
          open={this.state.messageOpen}
          title={'Trekk tilbake varslingen'}
          message={'Er du sikker på at du vil trekke tilbake varslingen'}
          customFunc={this.deleteTicket.bind(this, this.state.selectedTicket)}
          callback={this.closeMessage}
        />
      </div>
    );
  }
}
