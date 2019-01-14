import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Button, Header, Icon, Menu, Segment, Sidebar, Grid, Divider, Container } from 'semantic-ui-react';

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
    return (
      <Sidebar
        as={Segment}
        animation="overlay"
        inverted
        onHide={() => this.handleSidebar()}
        vertical
        visible={this.props.visible}
        color={menuColor}
      >
        <Segment basic inverted color={menuColor}>
          <Menu borderless fluid inverted vertical color={menuColor}>
            <Header as="h5" floated="right" inverted>
              <Icon name="close" inverted onClick={() => this.handleSidebar()} />
            </Header>
            <Header as="h2" floated="left" inverted>
              Meny
            </Header>
            <PrivateOptions />
            <Divider />
            <AdminOptions />
            <Divider />
            <MunicipalOptions />
            <Divider />
            <CompanyOptions />
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
        <NavLink to="/admin/users" activeClassName="active" className="ui item">
          Administrer brukere
        </NavLink>
        <NavLink to="/admin/categories" activeClassName="active" className="ui item">
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
        <NavLink to="/employee/tickets" activeClassName="active" className="ui item">
          Behandle innsendte varsler
        </NavLink>
        <NavLink to="/employee/news" activeClassName="active" className="ui item">
          Administrer nyheter
        </NavLink>
        <NavLink to="/employee/assignments" activeClassName="active" className="ui item">
          Behandle unsendte oppdrag
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
        <NavLink to="/assignments" activeClassName="active" className="ui item">
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
        <NavLink to="/profile" activeClassName="active" className="ui item">
          Min profil
        </NavLink>
        <NavLink to="/report" activeClassName="active" className="ui item">
          Meld inn varsel
        </NavLink>
        <NavLink to="/feed" activeClassName="active" className="ui item">
          Nyhetsstrøm
        </NavLink>
        <NavLink to="/tickets" activeClassName="active" className="ui item">
          Mine varslinger
        </NavLink>
        <NavLink to="/subscriptions" activeClassName="active" className="ui item">
          Nyheter jeg følger
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}
