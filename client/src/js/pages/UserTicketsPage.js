import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal, Segment, Divider } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { ModalTicketWidget } from '../widgets/TicketFormWidget';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { SOFT_DELETED } from '../commons';
import { categoryService } from '../services/CategoryServices';
import { newsService } from '../services/NewsServices';

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.editTicket = this.editTicket.bind(this);
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      showEditTicket: false,
      ticket: null,
      tickets: [],
      messageOpen: false,
      selectedTicket: '',
      news: [],
      newsOptions: []
    };
  }

  editTicket = (id, title, description, lat, lng, address, category, municipalId, subscribed, image, status) => {
    if (!title || !description || !category) {
      toast.error('Vennligst fyll inn alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      ticketService
        .updateTicket(id, title, description, lat, lng, address, category, municipalId, subscribed, image)
        .then(res => {
          if (res.success) {
            this.setState({ showEditTicket: false });
            toast.success(res.message.no, { position: toast.POSITION.TOP_RIGHT });
            //finding index to old ticket
            let index = -1;
            this.state.tickets.filter((t, i) => (t.id === id ? (index = i) : null));

            //setting variable to old ticket to new ticket values
            let ti = this.state.tickets;
            ti[index].title = title;
            ti[index].description = description;
            ti[index].category = category;
            ti[index].subscribed = subscribed;
            ti[index].image = image;
            ti[index].status = status;

            this.setState({ tickets: ti });

            this.close();
          } else {
            toast.error(res.message.no, { position: toast.POSITION.TOP_RIGHT });
          }
        });
    }
  };

  close = state => {
    this.setState({ [state]: false });
  };

  show = (state, ticket, id) => {
    this.setState({ [state]: true, ticket: ticket, selectedTicket: id });
  };

  componentWillMount() {
    let news = [];
    let ids = [];
    let newsOptions = [];
    ticketService
      .getTickets()
      .then(res => {
        this.setState({ tickets: res.data });
      })
      .then(() => {
        categoryService
          .getCategories()
          .then(res => {
            res.data.map(cat => {
              ids.push(cat.id);
            });
          })
          .then(() => {
            newsService.getFilteredNews(Cookies.get('municipalId'), ids, 0, 0).then(res => {
              res.data.map(news => {
                newsOptions.push({ key: news.id, value: news.id, text: news.title });
              });
              news = res.data;
              this.setState({ news: news, newsOptions: newsOptions });
            });
          });
      });
  }

  deleteTicket(id) {
    if (!id) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    }

    ticketService.deleteTicket(id).then(res => {
      if (res.success) {
        this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });
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
    console.log(this.state.news);
    return (
      <>
        <Container>
          <Divider hidden />
          <Divider hidden />
          <Header as="h1">Mine varslinger</Header>
          <Segment basic color="blue">
            <Grid stackable container columns={3}>
              {this.state.tickets.map(ticket =>
                ticket.status !== SOFT_DELETED ? (
                  <Grid.Column key={ticket.id}>
                    <TicketWidget
                      ticket={ticket}
                      show={this.show}
                      news={this.state.news}
                      newsOptions={this.state.newsOptions}
                    />
                  </Grid.Column>
                ) : null
              )}
            </Grid>
          </Segment>
        </Container>
        <ModalTicketWidget
          open={this.state.showEditTicket}
          editTicket={this.editTicket}
          close={this.close.bind(this, 'showEditTicket')}
          ticket={this.state.ticket}
          submitButton={'Lagre endringer'}
        />

        <MessageWidget
          size={'tiny'}
          open={this.state.messageOpen}
          title={'Trekk tilbake varslingen'}
          message={'Er du sikker på at du vil trekke tilbake varslingen'}
          customFunc={this.deleteTicket.bind(this, this.state.selectedTicket)}
          callback={this.close.bind(this, 'messageOpen')}
        />
      </>
    );
  }
}
