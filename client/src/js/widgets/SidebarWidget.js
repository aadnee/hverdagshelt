import * as React from "react";
import {NavLink} from "react-router-dom";

import {Button, Header, Icon, Image, Menu, Segment, Sidebar} from 'semantic-ui-react'


export class Menubarold extends React.Component {
    state = {visible: false};

    handleHideClick = () => this.setState({visible: false});
    handleShowClick = () => this.setState({visible: true});
    handleSidebarHide = () => this.setState({visible: false});

    //Variable that decides the type of user that is logged in.
    //Use this to decide what type of options in the menu to render
    permission = 0;

    render() {
        const {visible} = this.state;

        const style = {height: "100vh"};

        return (
            <div style={style}>
                <Button.Group>
                    <Button disabled={visible} onClick={this.handleShowClick}>
                        Show sidebar
                    </Button>
                    <Button disabled={!visible} onClick={this.handleHideClick}>
                        Hide sidebar
                    </Button>
                </Button.Group>


                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={visible}
                        width='wide'
                    >
                        //Header
                        <Header size="huge" inverted={true} id={"sidebarHeader"}>Menu</Header>

                        <Header size='large' className='sidebarHeaders' inverted={true}>Privatperson</Header>
                        <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Mine varsler</Menu.Item>
                        <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Nyhetsoppdateringer</Menu.Item>
                        <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Nyheter jeg følger</Menu.Item>




                    </Sidebar>


                    <Sidebar.Pusher>
                        <Segment basic>
                            <Header as='h3'>Application Content</Header>

                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

class AdminOptions extends React.Component {

    render() {
        return (
            <div>
                <Header size='large' className='sidebarHeaders' inverted={true}>Administrator</Header>
                <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Adm. brukere</Menu.Item>
                <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Adm. kategorier</Menu.Item>
            </div>
        )
    }
}

class MunicipalOptions extends React.Component {

    render() {
        return (
            <div>
                <Header size='large' className='sidebarHeaders' inverted={true}>Komunneansatt</Header>
                <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Behandle varsler</Menu.Item>
                <Menu.Item as='a' className={'ui grey header sidebarLink borderless'}>Adm. nyhetsvarlser</Menu.Item>
            </div>
        )
    }
}

class CompanyOptions extends React.Component {

    render() {
        return (
            <div>
                <Header size='large' className='sidebarHeaders' inverted={true}>Bedrift</Header>
                <Menu.Item as='a' className={' ui grey header sidebarLink borderless'}>Mine oppdrag</Menu.Item>
            </div>
        )
    }
}



