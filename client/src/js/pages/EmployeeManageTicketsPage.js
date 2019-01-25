import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Grid,
  Header,
  Message,
  Container,
  Segment,
  Divider,
  Modal,
  Input,
  Button,
  Icon,
  Form,
  Pagination
} from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { ticketService } from '../services/TicketServices';
import { subscriptionService } from '../services/SubscriptionServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { newsService } from '../services/NewsServices';
import { categoryService } from '../services/CategoryServices';

export class EmployeeManageTicketsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      hasTickets: true,
      modalOpen: false,
      modalParam: '',
      message: '',
      bindNewsModalOpen: false,
      news: [],
      newsOptions: [],
      loading: true,
      page: 1,
      totalPages: 0
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
    console.log('mounting');
    let tickets = [];
    let ids = [];
    let news = [];
    let newsOptions = [];
    ticketService
      .getMunicipalTickets(Cookies.get('municipalId'))
      .then(res => {
        if (res.data.length < 1) {
          this.setState({ hasTickets: false });
        }
        tickets = res.data;
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

              this.setState({
                tickets: tickets,
                news: news,
                newsOptions: newsOptions,
                totalPages: Math.ceil(tickets.length / 9),
                loading: false
              });
            });
          });
      });
  }

  render() {
    const { news, newsOptions } = this.state;
    console.log(this.state.tickets);
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Varslinger fra brukerne</Header>
        <Segment color="blue" basic>
          <Grid stackable container columns={3}>
            {!this.state.hasTickets ? (
              <Grid.Row centered="true">
                <Message size={'massive'}>
                  <p>Du har ingen flere varsler å administrere</p>
                </Message>
              </Grid.Row>
            ) : null}
            {this.state.loading ? (
              <>
                <Divider hidden />
                <Message icon>
                  <Icon name="circle notched" loading />
                  <Message.Content>
                    <Message.Header>Vennligst vent</Message.Header>
                    Henter informasjon
                  </Message.Content>
                </Message>
              </>
            ) : (
              <>
                {this.state.tickets.map((ticket, i) => (
                  <React.Fragment key={ticket.id}>
                    {i <= this.state.page * 9 - 1 && i > (this.state.page - 1) * 9 - 1 ? (
                      <Grid.Column>
                        <TicketWidget
                          employee
                          ticket={ticket}
                          accept={this.accept.bind(this, ticket.id)}
                          show={this.show.bind(this, ticket.id)}
                          link={this.bindUserToNews.bind(this, ticket.id)}
                          news={news}
                          newsOptions={newsOptions}
                        />
                      </Grid.Column>
                    ) : null}
                  </React.Fragment>
                ))}
              </>
            )}
          </Grid>

          <Modal open={this.state.modalOpen} onClose={this.close} closeIcon>
            <Header icon="trash" content="Avslå varsel" />
            <Modal.Content>
              <Form>
                <Form.Field>
                  <label>Melding til varsler:</label>
                  <Input
                    value={this.state.message}
                    fluid
                    placeholder="Melding til varsler om avslag"
                    onChange={(e, d) => {
                      this.setState({ message: d.value });
                    }}
                  />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button secondary onClick={() => this.close()}>
                <Icon name="remove" /> Avbryt
              </Button>
              <Button
                primary
                onClick={() => {
                  this.reject(this.state.modalParam, this.state.message);
                }}
              >
                <Icon name="checkmark" /> Send avslag
              </Button>
            </Modal.Actions>
          </Modal>
          {/*<MessageWidget
            title={'Avslå nyhet'}
            size={'tiny'}
            open={this.state.modalOpen}
            message="Er du sikker på at du vil avslå innsendingen?"
            customFunc={this.reject.bind(this, this.state.modalParam)}
            callback={this.close}
          />*/}
        </Segment>
        <Container textAlign="center">
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          {!this.state.loading && this.state.totalPages > 1 ? (
            <Pagination
              defaultActivePage={this.state.page}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              totalPages={this.state.totalPages}
              onPageChange={(e, d) => this.setState({ page: d.activePage })}
            />
          ) : null}
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
        </Container>
      </Container>
    );
  }

  reject(id, msg) {
    console.log(id);
    console.log(msg);

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

  accept = (id, title, description, lat, lon, address, categoryId, publish, municipalId, images) => {
    if (!title || !description || !lat || !lon || !categoryId) {
      console.log(title, description, lat, lon, categoryId);
      return false;
    } else {
      let imgIds = images.map(i => i.id);
      return ticketService
        .acceptTicket(id, title, description, lat, lon, address, categoryId, publish, municipalId, imgIds)
        .then(res => {
          if (res.success) {
            let index = -1;
            let ticket = null;
            let tick = this.state.tickets;
            tick.map((t, i) => {
              if (t.id === id) {
                index = i;
                ticket = t;
                return true;
              }
            });

            console.log(index);
            console.log(id);

            console.log(tick.splice(index, 1));
            console.log(tick);
            this.setState({ tickets: tick });
            if (ticket.subscribed) {
              subscriptionService.addSubscription(res.id, ticket.userId).then(res => {
                if (res.success) {
                  console.log(res.message.no);
                }
              });
            }
            if (this.state.tickets.length < 1) {
              this.setState({ hasTickets: false });
            }
            toast.success(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
            return true;
          } else {
            toast.error(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
    }
  };

  bindUserToNews(ticketId, newsId) {
    if (!ticketId || !newsId) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    ticketService.linkTicket(ticketId, newsId).then(res => {
      if (res.success) {
        this.setState({ tickets: this.state.tickets.filter(t => t.id !== id), modalOpen: false });

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
