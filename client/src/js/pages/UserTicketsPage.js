import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';
import { ticketService } from "../services/TicketServices";

export class UserTicketsPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      tickets: []
    }
  }


  componentWillMount() {

    ticketService.getTickets().then(res => {
      console.log(res);
      this.setState({'tickets': res.data});
    })
  }

  render() {
    return (
      <div>
        <Header textAlign={'center'} size={'huge'}>
          Mine varlsinger
        </Header>
        <Grid stackable container columns={3}>
          {this.state.tickets.map(ticket => (
              <Grid.Column key={ticket.id}>
                <TicketWidget ticket={ticket} />
              </Grid.Column>
          ))}

        </Grid>
      </div>
    );
  }
}
