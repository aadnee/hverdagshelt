import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';

//import {} from './';

export class MyWidget extends Component {
  render() {
    console.log('This is a Widget');
    return <h1>Hello Widget!</h1>;
  }
}
