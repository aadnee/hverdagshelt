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
          <Grid.Column mobile={16} tablet={8} computer={6} largeScreen={6} widescreen={6}>
            <LoginWidget logo register />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
