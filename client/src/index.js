import ReactDOM from 'react-dom';
import * as React from 'react';
import { HashRouter, Route, NavLink } from 'react-router-dom';
import { Sidebar, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { AppRouter } from './js/AppRouter';
import { PageController } from './js/PageController';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

const root = document.getElementById('root');

if (root) {
  ReactDOM.render(<PageController />, root);
}
