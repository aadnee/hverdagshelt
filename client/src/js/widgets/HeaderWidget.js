import * as React from 'react';
import {NavLink} from "react-router-dom";
import {Menu, Dropdown, Button, Icon, Image} from 'semantic-ui-react';

export class HeaderWidget extends React.Component {



    render() {
        return (
            <Menu inverted color="blue" size='small' >
                <Menu.Item >
                    <NavLink to="/"><Image src='img/vector-logo-lav-hvit.png' size='medium' /></NavLink>
                </Menu.Item>
                <Menu.Menu position='right'>
                    <MyPageHeaderWidget/>
                    <LoginRegisterHeaderWidget/>
                </Menu.Menu>
            </Menu>
        );
    }
}

export class MyPageHeaderWidget extends React.Component {
    render() {
        return (
            <Dropdown item icon="user">
                <Dropdown.Menu>
                    <Dropdown.Item>Din Side</Dropdown.Item>
                    <Dropdown.Item>Logg av</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export class LoginRegisterHeaderWidget extends React.Component {
    render() {
        return (
            <Menu.Item>
                <div>
                    <Button primary>Registrere</Button>
                    <Button primary>Logg inn</Button>
                </div>
            </Menu.Item>
        )
    }
}