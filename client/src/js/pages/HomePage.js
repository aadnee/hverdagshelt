import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

import { SidebarWidget } from './../widgets/SidebarWidget';

export class HomePage extends Component {
  render() {
    return <Header as="h2">Hovedside</Header>;
  }
}
