import React from 'react';
import { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Consumer } from './../context';
import { Container, Header, Grid, Divider } from 'semantic-ui-react';
import { LoginWidget } from './../widgets/LoginWidget';

//import {} from './../widgets';

export class LogoutPage extends Component {
  render() {
    if (Consumer._currentValue.user != null) {
      Consumer._currentValue.logout();
    }
    return <Redirect to="/login" />;
  }
}
