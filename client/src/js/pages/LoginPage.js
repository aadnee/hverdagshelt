import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Divider } from 'semantic-ui-react';
import { LoginWidget } from './../widgets/LoginWidget';

export class LoginPage extends Component {
  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        <Divider hidden />
        <Grid centered columns={2}>
          <Grid.Column mobile={16} tablet={8} computer={6} largeScreen={6} widescreen={6}>
            <LoginWidget logo register />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
