import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import { Sidebar, Container, Segment } from 'semantic-ui-react';

import { AppRouter } from './AppRouter';
import { SidebarWidget } from './widgets/SidebarWidget';
import { HeaderWidget } from './widgets/HeaderWidget';

export class PageController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
  }

  toggleSideBar(action) {
    this.setState({ visible: action });
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
