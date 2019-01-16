import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Header} from 'semantic-ui-react';
import {MapWidget} from '../widgets/MapWidget';

import {SidebarWidget} from './../widgets/SidebarWidget';

export class HomePage extends Component {
  constructor(props){
    super(props);
    this.state={};
  }

  callback() {
  }

  render() {
    return (
    <div>
      <MapWidget modal callback={this.callback}/>
    </div>
    );
  }
}
