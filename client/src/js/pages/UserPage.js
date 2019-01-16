import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { userService } from '../services/UserServices';
import { UserEditFormWidget } from './../widgets/UserEditFormWidget';
import { Container, Grid, Header, Divider } from 'semantic-ui-react';

export class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentWillMount() {
    userService.getMe().then(res => {
      console.log(res);
      this.setState({ user: res.data });
    });
  }

  render() {
    if (this.state.user) {
      return (
        <Container>
          <Divider hidden />
          <Divider hidden />
          <Grid columns={2} centered>
            <Grid.Column width={11}>
              <Header as="h1">Min side</Header>
              <UserEditFormWidget user={this.state.user} />
            </Grid.Column>
          </Grid>
        </Container>
      );
    } else {
      return null;
    }
  }
}
