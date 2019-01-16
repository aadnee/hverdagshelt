import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Consumer } from './../context';
import { Menu, Dropdown, Button, Icon, Image } from 'semantic-ui-react';

export class HeaderWidget extends React.Component {
  render() {
    let loggedIn = Consumer._currentValue.user ? true : false;
    return (
      <Menu inverted color="blue" secondary>
        <Menu.Item onClick={() => this.props.toggle(true)} icon="list layout" />
        <Menu.Item>
          <NavLink to="/">
            <Image src="img/compact-vector-logo-lav-hvit.png" size="medium" />
          </NavLink>
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
          <Dropdown.Item>
            <NavLink activeClassName="active" style={{ color: 'black' }} to="/profile">
              Min side
            </NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink activeClassName="active" style={{ color: 'black' }} to="/logout">
              Logg av
            </NavLink>
          </Dropdown.Item>
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
          <Dropdown.Item>
            <NavLink activeClassName="active" style={{ color: 'black' }} to="/login">
              Logg inn
            </NavLink>
          </Dropdown.Item>
          <Dropdown.Item>
            <NavLink activeClassName="active" style={{ color: 'black' }} to="/register">
              Registrer deg
            </NavLink>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
