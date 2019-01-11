import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import { TicketWidget } from '../widgets/TicketWidget';

export class UserTicketsPage extends Component {
  tickets = [
    {
      title: 'Tittel',
      description: 'Beskrivelse æpasdjf paj sdjf asølkdfj aslkjf' + 'skjdf ølaskjfasklfj ',
      status: 3,
      createdAt: '12/03/2018',
      category: 'kategori',
      subCategory: 'sub-kategori'
    }
  ];
  componentWillMount() {
    //fetch tickets
  }

  render() {
    return (
      <div>
        <Header textAlign={'center'} size={'huge'}>
          Mine varlsinger
        </Header>
        <Grid stackable container columns={3}>
          <Grid.Column>
            <TicketWidget ticket={this.tickets[0]} />
          </Grid.Column>
          <Grid.Column>
            <TicketWidget ticket={this.tickets[0]} />
          </Grid.Column>
          <Grid.Column>
            <TicketWidget ticket={this.tickets[0]} />
          </Grid.Column>
          <Grid.Column>
            <TicketWidget ticket={this.tickets[0]} />
          </Grid.Column>
          <Grid.Column>
            <TicketWidget ticket={this.tickets[0]} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
