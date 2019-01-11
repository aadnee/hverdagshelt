import * as React from 'react';
import { NavLink } from 'react-router-dom';

import { Button, Header, Icon, Image, Menu, Segment, Sidebar, Grid, Divider } from 'semantic-ui-react';

export class SidebarWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: this.props.visible };
  }

  handleHideClick = () => this.setState({ visible: false });
  handleShowClick = () => this.setState({ visible: true });
  handleSidebarHide = () => {
    this.props.response();
  };

  //Variable that decides the type of user that is logged in.
  //Use this to decide what type of options in the menu to render
  //1 regular
  //2 municipal
  //3 admin
  //4 Company
  //5 All for development purposes
  permission = 5;

  // <Button.Group>
  //   /*Buttons for opening and closing the sidebar, will be added as an icon on the header*/
  //   <Button disabled={visible} onClick={this.handleShowClick}>
  //     Show sidebar
  //   </Button>
  //   <Button disabled={!visible} onClick={this.handleHideClick}>
  //     Hide sidebar
  //   </Button>
  // </Button.Group>

  componentWillUpdate(prevProps) {
    if (this.state.visible != prevProps.visible) {
      if (this.props.visible) {
        this.handleShowClick();
      } else {
        this.handleHideClick();
      }
    }
  }

  render() {
    let visible = this.state.visible;

    return (
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        onHide={this.handleSidebarHide}
        vertical
        visible={visible}
        width="wide"
      >
        <Header size="huge" inverted={true} id={'sidebarHeader'}>
          Menu
        </Header>

        <div className="sidebarComponents">
          <Header size="large" className="sidebarHeaders" inverted={true}>
            Privatperson
          </Header>
          <Menu.Item href="/subscriptions" as="a" className={' ui grey header sidebarLink borderless'}>
            Mine varsler
          </Menu.Item>
          <Menu.Item href={'/feed'} as="a" className={'ui grey header sidebarLink borderless'}>
            Nyhetsoppdateringer
          </Menu.Item>
          <Menu.Item href={'/subscriptions'} as="a" className={'ui grey header sidebarLink borderless'}>
            Nyheter jeg følger
          </Menu.Item>

          {this.permission === 2 ? <MunicipalOptions /> : null}
          {this.permission === 3 ? (
            <div>
              <AdminOptions />
              <CompanyOptions />
            </div>
          ) : null}
          {this.permission === 4 ? <CompanyOptions /> : null}
          {this.permission === 5 ? (
            <div>
              <MunicipalOptions /> <AdminOptions />
              <CompanyOptions />
            </div>
          ) : null}
        </div>
      </Sidebar>
    );
  }
}

class AdminOptions extends React.Component {
  render() {
    return (
      <div>
        <Header size="large" className="sidebarHeaders" inverted={true}>
          Administrator
        </Header>
        <Menu.Item className={'ui grey header sidebarLink borderless'}>
          <NavLink to="/admin/users" activeClassName="active">
            Adm. brukere
          </NavLink>
        </Menu.Item>
        <Menu.Item className={'ui grey header sidebarLink borderless'}>
          <NavLink to="/admin/categories" activeClassName="active">
            Adm. kategorier
          </NavLink>
        </Menu.Item>
      </div>
    );
  }
}

class MunicipalOptions extends React.Component {
  render() {
    return (
      <div>
        <Header size="large" className="sidebarHeaders" inverted={true}>
          Komunneansatt
        </Header>
        <Menu.Item href={'/employee/tickets'} as="a" className={'ui grey header sidebarLink borderless'}>
          Behandle varsler
        </Menu.Item>
        <Menu.Item href={'/employee/news'} as="a" className={'ui grey header sidebarLink borderless'}>
          Adm. nyhetsvarlser
        </Menu.Item>
      </div>
    );
  }
}

class CompanyOptions extends React.Component {
  render() {
    return (
      <div>
        <Header size="large" className="sidebarHeaders" inverted={true}>
          Bedrift
        </Header>
        <Menu.Item href={'/assignments'} as="a" className={' ui grey header sidebarLink borderless'}>
          Mine oppdrag
        </Menu.Item>
      </div>
    );
  }
}
