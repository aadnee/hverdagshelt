import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Consumer } from './context';
import { COMPANY } from './commons';

const CompanyRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = Consumer._currentValue.user ? true : false;
  const userRank = Consumer._currentValue.user ? Consumer._currentValue.user.rank : -1;

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn && userRank == COMPANY ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/403', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default CompanyRoute;
