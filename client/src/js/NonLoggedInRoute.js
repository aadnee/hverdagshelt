import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Consumer } from './context';
import { ADMIN } from './commons';

const NonLoggedInRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = Consumer._currentValue.user ? true : false;

  return (
    <Route
      {...rest}
      render={props =>
        !isLoggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      }
    />
  );
};

export default NonLoggedInRoute;
