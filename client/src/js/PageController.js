import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import { Sidebar, Container } from 'semantic-ui-react';

import { AppRouter } from './AppRouter';
import { SidebarWidget } from './widgets/SidebarWidget';
import { HeaderWidget } from './widgets/HeaderWidget';

export class PageController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
  }

  toggleSideBar() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <HashRouter>
        <Sidebar.Pushable style={{ height: '100vh' }}>
          <SidebarWidget visible={this.state.visible} response={this.toggleSideBar} />
          <Sidebar.Pusher dimmed={this.state.visible}>
            <HeaderWidget toggle={this.toggleSideBar} />
            <AppRouter />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </HashRouter>
    );
  }
}
