import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component, createContext } from 'react';
import Cookies from 'js-cookie';
import {HashRouter, NavLink} from 'react-router-dom';
import { Sidebar, Container, Segment, Dimmer, Loader, Image, Divider } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppRouter } from './AppRouter';
import { SidebarWidget } from './widgets/SidebarWidget';
import { HeaderWidget } from './widgets/HeaderWidget';
import { FooterWidget } from './widgets/FooterWidget';

import { Provider, Consumer } from './context';

import { userService } from './services/UserServices';
import { ticketService } from './services/TicketServices';
import { subscriptionService } from './services/SubscriptionServices';

export class PageController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      login: this.login,
      logout: this.logout,
      prompt: this.promptUser,
      ticketSubmit: this.ticketSubmit,
      unsubscribeNews: this.unsubscribeNews,
      convDbString: this.dbStringConverter,
      visible: false,
      renderReady: false,
      prompted: false
    };

    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.promptUser = this.promptUser.bind(this);
    this.unsubscribeNews = this.unsubscribeNews.bind(this);
  }

  toggleSideBar(action) {
    this.setState({ visible: action });
  }

  componentWillMount() {
    if (Cookies.get('token') && this.state.user == null) {
      userService.getMe().then(res => {
        if (res.success) {
          this.setState({ user: res.data, renderReady: true });
        } else {
          this.setState({ user: null, renderReady: true });
        }
      });
    } else {
      this.setState({ renderReady: true });
    }
  }

  /*
   *Functins to Context
   */

  login = (email, password) => {
    userService.login(email, password).then(res => {
      if (res.success) {
        userService.getMe().then(res => {
          if (res.success) {
            this.setState({ user: res.data });
          } else {
            toast.error('Noe gikk galt, prøv igjen senere.');
          }
        });
      } else {
        toast.error('Brukernavn eller passord er feil.');
      }
    });
  };

  logout = () => {
    Cookies.remove('token');
    Cookies.remove('rank');
    Cookies.remove('municipalId');
    this.setState({ user: null });
  };

  promptUser = () => {
    console.log('prompted: '+ this.state.prompted);
    if(!this.state.prompted) {
      toast.info(this.state.loggedIn ? "Trykk på kartet for å melde inn en sak" :
          <><NavLink to={'/login'} style={{color: 'white', textDecoration: 'underline'}}><b>Logg inn</b></NavLink> eller <NavLink to={'/register'} style={{color: 'white', textDecoration: 'underline'}}><b>registrer deg</b></NavLink> for å
            melde en sak</>, {
        position: 'bottom-left',
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
      });
      this.setState({prompted: true});
    }
  };

  dbStringConverter = (dbString, array) => {
  let type = array ? array : false;
    const dateArr = dbString.split('T')[0].split('-');
    const date = dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0];

    const clockArr = dbString
      .split('T')[1]
      .split('.')[0]
      .split(':');

    const clock = clockArr[0] + ':' + clockArr[1];
    if (!type) {
      return date + ' ' + clock;
    } else {
      return [date, clock];
    }
  };

  ticketSubmit = (title, description, lat, lon, address, catId, subscribed, image, municipalName) => {
    //lat, lon  is fetched from the map

    if (!title || !description || !lat || !lon || !catId || !municipalName) {
      toast.error('Vennligst fyll ut alle felt', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      ticketService
        .addTicket(title, description, lat, lon, address, catId, subscribed, image, municipalName)
        .then(res => {
          if (res.success) {
            toast.success(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
            Consumer._currentValue.history.push({ pathname: '/tickets' });
          } else {
            toast.error(res.message.no, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        });
    }
  };

  unsubscribeNews(newsId) {
    if (!newsId) {
      toast.error('Noe gikk galt, prøv igjen', {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      return subscriptionService.deleteSubscription(newsId).then(res => {
        return res;
      });
    }
    return null;
  }

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
              <SidebarWidget visible={this.state.visible} response={this.toggleSideBar} />
              <Sidebar.Pushable style={{ minHeight: '100vh' }}>
                <Sidebar.Pusher dimmed={this.state.visible} style={{ minHeight: '100vh' }}>
                  <HeaderWidget toggle={this.toggleSideBar} />
                  <AppRouter />
                </Sidebar.Pusher>
              </Sidebar.Pushable>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover
              />
              <FooterWidget />
            </>
          </HashRouter>
        </Provider>
      );
    }
  }
}
