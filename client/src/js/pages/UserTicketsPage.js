import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header, Container, Modal, Segment, Divider, Pagination, Tab, Message, Icon } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from '../services/TicketServices';
import { ModalTicketWidget } from '../widgets/TicketFormWidget';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { TicketFormWidget } from '../widgets/TicketFormWidget';
import { MessageWidget } from '../widgets/MessageWidget';
import { SOFT_DELETED, PENDING, INPROGRESS, DONE, REJECTED } from '../commons';
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
      newsOptions: [],
      activePage: 1,
      totalPages: 0
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
            this.state.tickets.filter((t, i) => (t.id == id ? (index = i) : null));

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
        this.setState({
          tickets: res.data,
          totalPages: Math.ceil(res.data.filter(t => t.status == PENDING).length / 9)
        });
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
    console.log('RENDER');
    let panes = [
      {
        menuItem: 'Under behandling',
        render: () => (
          <Tab.Pane className="frontPageFeedTab">
            <Grid stackable container doubling columns={3}>
              {this.state.tickets.filter(t => t.status == PENDING).length > 0 ? (
                this.state.tickets
                  .filter(t => t.status == PENDING)
                  .map((ticket, i) => (
                    <React.Fragment key={ticket.id}>
                      {i <= this.state.activePage * 9 - 1 && i > (this.state.activePage - 1) * 9 - 1 ? (
                        <Grid.Column key={ticket.id}>
                          <TicketWidget
                            ticket={ticket}
                            show={this.show}
                            news={this.state.news}
                            newsOptions={this.state.newsOptions}
                          />
                        </Grid.Column>
                      ) : null}
                    </React.Fragment>
                  ))
              ) : (
                <>
                  <Divider hidden />
                  <Message icon success>
                    <Icon name="folder open outline" />
                    <Message.Content>
                      <Message.Header>Tomt!</Message.Header>
                      Du har ingen varslinger under behandling.
                    </Message.Content>
                  </Message>
                </>
              )}
            </Grid>
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Godkjent',
        render: () => (
          <Tab.Pane className="frontPageFeedTab">
            <Grid stackable container doubling columns={3}>
              {this.state.tickets.filter(t => t.status == DONE).length > 0 ? (
                this.state.tickets
                  .filter(t => t.status == DONE)
                  .map((ticket, i) => (
                    <React.Fragment key={ticket.id}>
                      {i <= this.state.activePage * 9 - 1 && i > (this.state.activePage - 1) * 9 - 1 ? (
                        <Grid.Column key={ticket.id}>
                          <TicketWidget
                            ticket={ticket}
                            show={this.show}
                            news={this.state.news}
                            newsOptions={this.state.newsOptions}
                          />
                        </Grid.Column>
                      ) : null}
                    </React.Fragment>
                  ))
              ) : (
                <>
                  <Divider hidden />
                  <Message icon success>
                    <Icon name="folder open outline" />
                    <Message.Content>
                      <Message.Header>Tomt!</Message.Header>
                      Du har ingen godkjente varslinger.
                    </Message.Content>
                  </Message>
                </>
              )}
            </Grid>
          </Tab.Pane>
        )
      },
      {
        menuItem: 'Avslått',
        render: () => (
          <Tab.Pane className="frontPageFeedTab">
            <Grid stackable container doubling columns={3}>
              {this.state.tickets.filter(t => t.status == REJECTED).length > 0 ? (
                this.state.tickets
                  .filter(t => t.status == REJECTED)
                  .map((ticket, i) => (
                    <React.Fragment key={ticket.id}>
                      {i <= this.state.activePage * 9 - 1 && i > (this.state.activePage - 1) * 9 - 1 ? (
                        <Grid.Column key={ticket.id}>
                          <TicketWidget
                            ticket={ticket}
                            show={this.show}
                            news={this.state.news}
                            newsOptions={this.state.newsOptions}
                          />
                        </Grid.Column>
                      ) : null}
                    </React.Fragment>
                  ))
              ) : (
                <>
                  <Divider hidden />
                  <Message icon success>
                    <Icon name="folder open outline" />
                    <Message.Content>
                      <Message.Header>Tomt!</Message.Header>
                      Du har ingen avslåtte varslinger.
                    </Message.Content>
                  </Message>
                </>
              )}
            </Grid>
          </Tab.Pane>
        )
      }
    ];

    return (
      <>
        <Container>
          <Divider hidden />
          <Divider hidden />
          <Header as="h1">Mine varslinger</Header>
          <Segment basic color="blue">
            <Tab
              menu={{ text: true, secondary: true, pointing: true, color: 'blue' }}
              panes={panes}
              onTabChange={(e, d) => {
                d.activeIndex == 0 ? (
                  <>
                    {console.log('PENDING')}
                    {this.setState({
                      totalPages: Math.ceil(this.state.tickets.filter(t => t.status == PENDING).length / 9),
                      activePage: 1
                    })}
                  </>
                ) : d.activeIndex == 1 ? (
                  <>
                    {console.log('DONE')}
                    {this.setState({
                      totalPages: Math.ceil(this.state.tickets.filter(t => t.status == DONE).length / 9),
                      activePage: 1
                    })}
                  </>
                ) : (
                  <>
                    {console.log('REJECT')}
                    {this.setState({
                      totalPages: Math.ceil(this.state.tickets.filter(t => t.status == REJECTED).length / 9),
                      activePage: 1
                    })}
                  </>
                );
                {
                  setTimeout(() => {
                    console.log(this.state.totalPages);
                  }, 100);
                }
              }}
            />
          </Segment>
        </Container>
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        {this.state.totalPages > 1 ? (
          <Container textAlign="center">
            <Pagination
              defaultActivePage={this.state.activePage}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              totalPages={this.state.totalPages}
              onPageChange={(e, d) => {
                this.setState({ activePage: d.activePage });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <Divider hidden />
            <Divider hidden />
            <Divider hidden />
          </Container>
        ) : null}
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
