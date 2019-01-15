import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';

//import {} from './../widgets';

export class AdminUsersPage extends Component {
  render() {
    return (
      <div>
        <UserComponentListWidget usertype />
      </div>
    );
  }
}
