import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';

import {TicketFormWidget} from '../widgets/TicketFormWidget';

export class UserReportTicketPage extends Component {
  render() {
    return(
        <TicketFormWidget/>
    )
  }
}
