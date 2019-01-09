import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';

import { LoginWidget } from './../widgets/LoginWidget';

export class LoginPage extends Component {
  render() {
    return (
      <Container>
        <Grid centered columns={2}>
          <Grid.Column>
            <LoginWidget logo register />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
