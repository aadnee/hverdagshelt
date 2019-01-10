import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Modal, Header } from 'semantic-ui-react';

import { TicketFormWidget } from '../widgets/TicketFormWidget';

//import {} from './../widgets';

export class UserReportTicketPage extends Component {
  static reportTicket() {
    console.log('report ticket');
  }
  render() {
    return (
      <div>
        <h1>Meld inn feil</h1>
        <Modal trigger={<Button>Show Modal</Button>}>
          <Modal.Header>Send inn en feil</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <TicketFormWidget />
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
