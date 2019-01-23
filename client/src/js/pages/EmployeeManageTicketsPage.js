import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Message, Container, Segment, Divider } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { ticketService } from '../services/TicketServices';
import { subscriptionService } from '../services/SubscriptionServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export class EmployeeManageTicketsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      hasTickets: true,
      modalOpen: false,
      modalParam: '',
      bindNewsModalOpen: false
    };
    this.reject = this.reject.bind(this);
    this.accept = this.accept.bind(this);
    this.bindUserToNews = this.bindUserToNews.bind(this);
    this.show = this.show.bind(this);
  }

  show = id => {
    this.setState({ modalOpen: true, modalParam: id });
  };

  close = () => this.setState({ modalOpen: false });

  componentWillMount() {
    //Fetch id based on user bound to municipal

    ticketService.getMunicipalTickets(Cookies.get('municipalId')).then(res => {
      if (res.data.length < 1) {
        this.setState({ hasTickets: false });
      }
      this.setState({ tickets: res.data });
    });
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Varslinger fra brukerne</Header>
        <Segment color="blue" basic>
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
                  show={this.show.bind(this, ticket.id)}
                  link={this.bindUserToNews.bind(this, ticket.id)}
                />
              </Grid.Column>
            ))}
          </Grid>
          <MessageWidget
            title={'Avslå nyhet'}
            size={'tiny'}
            open={this.state.modalOpen}
            message="Er du sikker på at du vil avslå innsendingen?"
            customFunc={this.reject.bind(this, this.state.modalParam)}
            callback={this.close}
          />
        </Segment>
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
      </Container>
    );
  }

  reject(id) {
    console.log(id);

    if (!id) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      ticketService.rejectTicket(id).then(res => {
        if (res.success) {
          this.setState({ tickets: this.state.tickets.filter(t => t.id !== id), modalOpen: false });

          if (this.state.tickets.length < 1) {
            this.setState({ hasTickets: false });
          }
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
  }

  accept(id, title, description, lat, lon, address, categoryId, publish, municipalId, images) {
    if (!title || !description || !lat || !lon || !categoryId) {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      ticketService
        .acceptTicket(id, title, description, lat, lon, address, categoryId, publish, municipalId, images)
        .then(res => {
          if (res.success) {
            let ticket = this.state.tickets.find(t => t.id === id);
            if (ticket.subscribed) {
              subscriptionService.addSubscription(res.id, ticket.userId).then(res => {
                console.log(res.message.no);
              });
            }
            this.setState({ tickets: this.state.tickets.filter(t => t.id !== id) });
            if (this.state.tickets.length < 1) {
              this.setState({ hasTickets: false });
            }
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
  }

  bindUserToNews(ticketId, newsId) {
    console.log(ticketId);
    console.log(newsId);
    if (!ticketId || !newsId) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    ticketService.linkTicket(ticketId, newsId).then(res => {
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
}
