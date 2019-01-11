import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header, Modal } from 'semantic-ui-react';
import { TicketFormWidget } from '../widgets/TicketFormWidget';

export class UserReportTicketPage extends Component {
  render() {
    return (
      <div>
        <Header size={'huge'} textAlign={'center'}>
          Meld inn feil
        </Header>
        <TicketFormWidget />
      </div>
    );
  }
}
