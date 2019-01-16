import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component, createContext } from 'react';
import Cookies from 'js-cookie';
import { HashRouter } from 'react-router-dom';
import { Sidebar, Container, Segment, Dimmer, Loader, Image, Divider } from 'semantic-ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppRouter } from './AppRouter';
import { SidebarWidget } from './widgets/SidebarWidget';
import { HeaderWidget } from './widgets/HeaderWidget';
import { FooterWidget } from './widgets/FooterWidget';

import { Provider, Consumer } from './context';

import { userService } from './services/UserServices';

export class PageController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      login: this.login,
      logout: this.logout,
      visible: false,
      renderReady: false
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggleSideBar(action) {
    this.setState({ visible: action });
  }

  componentWillMount() {
    if (Cookies.get('token') && this.state.user == null) {
      userService.getMe().then(res => {
        if (res.success) this.setState({ user: res.data, renderReady: true });
      });
    } else {
      this.setState({ renderReady: true });
    }
  }

  login = (email, password) => {
    userService.login(email, password).then(res => {
      console.log(res);
      if (res.success) {
        userService.getMe().then(res => {
          this.setState({ user: res.data });
        });
      }
    });
  };

  logout = () => {
    Cookies.remove('token');
    Cookies.remove('rank');
    Cookies.remove('municipalId');
    this.setState({ user: null });
  };

  render() {
    if (!this.state.renderReady) {
      return (
        <Dimmer active>
          <Loader indeterminate>Laster siden</Loader>
        </Dimmer>
      );
    } else {
      return (
        <Provider value={this.state}>
          <HashRouter>
            <>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
              />
              <Sidebar.Pushable style={{ height: '100vh' }}>
                <SidebarWidget visible={this.state.visible} response={this.toggleSideBar} />
                <Sidebar.Pusher dimmed={this.state.visible}>
                  <HeaderWidget toggle={this.toggleSideBar} />
                  <AppRouter />
                  <Divider hidden />
                  <Divider hidden />
                  <FooterWidget />
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            </>
          </HashRouter>
        </Provider>
      );
    }
  }
}
