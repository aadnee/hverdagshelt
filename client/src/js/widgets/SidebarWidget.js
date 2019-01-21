import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { USER, COMPANY, EMPLOYEE, ADMIN } from './../commons';

import { Button, Header, Icon, Menu, Segment, Sidebar, Grid, Divider, Container, Label } from 'semantic-ui-react';

let menuColor = null;

export class SidebarWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: this.props.visible };
  }

  handleSidebar() {
    this.props.response(false);
  }

  //Variable that decides the type of user that is logged in.
  //Use this to decide what type of options in the menu to render
  //1 regular
  //2 municipal
  //3 admin
  //4 Company
  //5 All for development purposes
  permission = 5;

  componentWillUpdate(prevProps) {
    if (this.props.visible != prevProps.visible) {
      this.setState({ visible: this.props.visible });
    }
  }

  render() {
    const rank = Consumer._currentValue.user ? Consumer._currentValue.user.rank : -1;
    return (
      <Sidebar
        as={Segment}
        animation="push"
        inverted
        onHide={() => this.handleSidebar()}
        vertical
        visible={this.props.visible}
        color={menuColor}
        onClick={() => this.handleSidebar()}
      >
        <Segment basic inverted color={menuColor}>
          <Menu borderless fluid inverted vertical color={menuColor}>
            <Button floated="right" icon="close" inverted circular />
            <Header as="h2" floated="left" inverted>
              Meny
            </Header>
            <PrivateOptions />
            {rank == ADMIN ? (
              <>
                <Divider /> <AdminOptions />
              </>
            ) : null}
            {rank >= EMPLOYEE ? (
              <>
                <Divider />
                <MunicipalOptions />
              </>
            ) : null}
            {rank == COMPANY ? (
              <>
                <Divider />
                <CompanyOptions />
              </>
            ) : null}
          </Menu>
        </Segment>
      </Sidebar>
    );
  }
}

class AdminOptions extends Component {
  render() {
    return (
      <Menu borderless fluid inverted vertical size="large" color={menuColor}>
        <Header as="h3" inverted>
          Administrator:
        </Header>
        <NavLink exact to="/admin/users" activeClassName="active" className="ui item">
          Administrer brukere
        </NavLink>
        <NavLink exact to="/admin/company" activeClassName="active" className="ui item">
          Administrer bedrifter
        </NavLink>
        <NavLink exact to="/admin/categories" activeClassName="active" className="ui item">
          Administrer kategorier
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}

class MunicipalOptions extends Component {
  render() {
    return (
      <Menu borderless fluid inverted vertical size="large" color={menuColor}>
        <Header as="h3" inverted>
          Ansatt:
        </Header>
        <NavLink exact to="/employee/tickets" activeClassName="active" className="ui item">
          Behandle innsendte varsler
          <Label circular size="tiny">
            11
          </Label>
        </NavLink>
        <NavLink exact to="/employee/news" activeClassName="active" className="ui item">
          Administrer nyheter
        </NavLink>
        <NavLink exact to="/employee/assignments" activeClassName="active" className="ui item">
          Behandle avslåtte oppdrag
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}

class CompanyOptions extends Component {
  render() {
    return (
      <Menu borderless fluid inverted vertical size="large" color={menuColor}>
        <Header as="h3" inverted>
          Bedrift:
        </Header>
        <NavLink exact to="/assignments" activeClassName="active" className="ui item">
          Mine oppdrag
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}

class PrivateOptions extends Component {
  render() {
    return (
      <Menu borderless fluid inverted vertical size="large" color={menuColor}>
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        <NavLink exact to="/" activeClassName="active" className="ui item">
          Hjem
        </NavLink>
        <NavLink exact to="/profile" activeClassName="active" className="ui item">
          Min side
        </NavLink>
        <NavLink exact to="/report" activeClassName="active" className="ui item">
          Meld inn varsel
        </NavLink>
        <NavLink exact to="/feed" activeClassName="active" className="ui item">
          Nyhetsstrøm
        </NavLink>
        <NavLink exact to="/tickets" activeClassName="active" className="ui item">
          Mine varslinger
        </NavLink>
        <NavLink exact to="/subscriptions" activeClassName="active" className="ui item">
          Nyheter jeg følger
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}
