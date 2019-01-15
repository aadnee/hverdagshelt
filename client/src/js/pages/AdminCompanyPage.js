import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { UserComponentListWidget } from '../widgets/UserComponentWidget';

//import {} from './../widgets';

export class AdminCompanyPage extends Component {
  render() {
    return (
      <div className={'container'}>
        <UserComponentListWidget />
      </div>
    );
  }
}
