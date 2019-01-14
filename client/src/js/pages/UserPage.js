import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {userService} from '../services/UserServices';
import {UserEditFormWidget} from './../widgets/UserEditFormWidget';

export class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    componentWillMount() {
        userService.getMe().then(res => {
            console.log(res);
            this.setState({user: res.data});
        });
    }

    render() {
        if (this.state.user) {
            console.log("noenting");
            return (
                <UserEditFormWidget user={this.state.user}/>
            );
        } else {
            console.log("ingenting");
            return null;
        }
    }
}
