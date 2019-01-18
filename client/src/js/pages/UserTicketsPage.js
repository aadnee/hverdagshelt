import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal, Segment } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { ModalTicketWidget } from '../widgets/TicketFormWidget';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MessageWidget } from '../widgets/MessageWidget';
export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.editTicket = this.editTicket.bind(this);
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

  editTicket = (id, title, description, lat, lng, address, category, municipalId, subscription, image, status) => {
    ticketService
      .UpdateTicket(id, title, description, lat, lng, address, category, municipalId, subscription, image)
      .then(res => {
        if (res.success) {
          toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
          let oldTicket = -1;
          this.state.tickets.find((t, i) => {
            id === t.id ? (oldTicket = i) : null;
          });
          this.state.tickets[oldTicket] = {
            id: id,
            title: title,
            description: description,
            lat: lat,
            lon: lng,
            address: address,
            category: category,
            municipalId: municipalId,
            subscription: subscription,
            image: image,
            status: status
          };
          console.log(id, title, description, lat, lng, address, category, municipalId, subscription, image, status);
          this.close();
          this.forceUpdate();
        } else {
          toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
        }
      });
  };

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
          <ModalTicketWidget
              showModalTicket={this.state.showEditTicket}
              editTicket={this.editTicket}
              close={this.close}
              ticket={this.state.editTicket}
              submitButton={'Lagre endringer'}
          />
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
