import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Consumer } from './../context';
import { Menu, Dropdown, Button, Icon, Image, Grid } from 'semantic-ui-react';

export class HeaderWidget extends React.Component {
  render() {
    let loggedIn = Consumer._currentValue.user ? true : false;
    return (
      <Menu inverted color="blue" secondary style={{ marginBottom: 0 }}>
        {loggedIn ? <Menu.Item onClick={() => this.props.toggle(true)} icon="list layout" /> : null}
        <Menu.Item>
          <Grid>
            <Grid.Row only="computer tablet">
              <NavLink to="/">
                <Image src="img/compact-vector-logo-lav-hvit.png" size="medium" />
              </NavLink>
            </Grid.Row>
            <Grid.Row only="mobile">
              <NavLink to="/">
                <Image src="img/logo-only-hvit.png" size="tiny" />
              </NavLink>
            </Grid.Row>
          </Grid>
        </Menu.Item>
        <Menu.Menu position="right">{loggedIn ? <MyPageHeaderWidget /> : <LoginRegisterHeaderWidget />}</Menu.Menu>
      </Menu>
    );
  }
}

export class MyPageHeaderWidget extends React.Component {
  render() {
    return (
      <Dropdown item text={'Hei, ' + Consumer._currentValue.user.firstName}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => Consumer._currentValue.history.push('/profile')}>Min side</Dropdown.Item>
          <Dropdown.Item onClick={() => Consumer._currentValue.history.push('/logout')}>Logg av</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export class LoginRegisterHeaderWidget extends React.Component {
  render() {
    return (
      <Dropdown item icon="user" text={'Ikke logget inn'}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => Consumer._currentValue.history.push('/login')}>Logg inn</Dropdown.Item>
          <Dropdown.Item onClick={() => Consumer._currentValue.history.push('/register')}>Registrer deg</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
