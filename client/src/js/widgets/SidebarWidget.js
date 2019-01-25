import * as React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Consumer } from './../context';
import { USER, COMPANY, EMPLOYEE, ADMIN } from './../commons';

import { ticketService } from './../services/TicketServices';

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
            {rank >= EMPLOYEE ? (
              <>
                <Divider />
                <MunicipalOptions />
              </>
            ) : null}
            {rank == ADMIN ? (
              <>
                <Divider /> <AdminOptions />
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
  constructor(props) {
    super(props);

    this.state = {
      pending: 0
    };

    this.updtInterval = null;
  }

  componentWillMount() {
    this.updateTicketCount();
    this.updtInterval = setInterval(() => {
      this.updateTicketCount();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.updtInterval);
  }

  updateTicketCount() {
    ticketService.getTicketsPending().then(res => {
      if (res.success && res.data != this.state.pending) {
        this.setState({ pending: res.data });
      }
    });
  }

  render() {
    return (
      <Menu borderless fluid inverted vertical size="large" color={menuColor}>
        <Header as="h3" inverted>
          Ansatt:
        </Header>
        <NavLink exact to="/employee/tickets" activeClassName="active" className="ui item">
          Behandle innsendte varsler
          {this.state.pending > 0 ? (
            <Label circular color="red" size="mini" horizontal>
              {this.state.pending}
            </Label>
          ) : null}
        </NavLink>
        <NavLink exact to="/employee/events" activeClassName="active" className="ui item">
          Behandle arrangementer
        </NavLink>
        {/*<NavLink exact to="/employee/assignments" activeClassName="active" className="ui item">
          Behandle avslåtte oppdrag
        </NavLink>*/}
        <NavLink exact to="/employee/news" activeClassName="active" className="ui item">
          Administrer nyheter
        </NavLink>
        <NavLink exact to="/employee/event" activeClassName="active" className="ui item">
          Registrer arrangement
        </NavLink>
        <NavLink exact to="/employee/Statistics" activeClassName="active" className="ui item">
          Statistikk
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
          {Consumer._currentValue.user.name}
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

        <NavLink exact to="/events" activeClassName="active" className="ui item">
          Arrangementer
        </NavLink>
        <NavLink exact to="/tickets" activeClassName="active" className="ui item">
          Mine varslinger
        </NavLink>
        <NavLink exact to="/subscriptions" activeClassName="active" className="ui item">
          Nyheter jeg følger
        </NavLink>
        <div className="ui item disabled" />
        <NavLink exact to="/archive" activeClassName="active" className="ui item">
          Nyhetsarkiv
        </NavLink>
        <div className="ui item disabled" />
      </Menu>
    );
  }
}
