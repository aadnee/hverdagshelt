import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { newsService } from '../services/NewsServices';

export class UserSubscriptionPage extends Component {
  constructor(props) {
    super(props);
    state = {};
  }

  componentWillMount() {}

  render() {
    return <h1>Hello World!</h1>;
  }
}
