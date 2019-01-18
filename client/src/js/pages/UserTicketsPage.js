import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { ModalTicketWidget } from '../widgets/TicketFormWidget';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.editTicket = this.editTicket.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);

    this.child = React.createRef();

    this.state = {
      refresh: 0,
      showEditTicket: false,
      editTicket: null,
      tickets: []
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
    this.refresh();
  };

  refresh = () => {};

  componentWillMount() {
    ticketService.getTickets().then(res => {
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
        <ModalTicketWidget
          showModalTicket={this.state.showEditTicket}
          editTicket={this.editTicket}
          close={this.close}
          ticket={this.state.editTicket}
          submitButton={'Lagre endringer'}
        />
      </div>
    );
  }
}
