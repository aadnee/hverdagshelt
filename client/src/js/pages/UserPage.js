import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { userService } from '../services/UserServices';
import { UserEditFormWidget } from './../widgets/UserEditFormWidget';
import { Container, Grid, Header } from 'semantic-ui-react';

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
      console.log('noenting');
      return (
        <Container>
          <Header as="h2">Din profil</Header>
          <Grid columns={2} centered>
            <Grid.Column width={11}>
              <UserEditFormWidget user={this.state.user} />
            </Grid.Column>
          </Grid>
        </Container>
      );
    } else {
      console.log('ingenting');
      return null;
    }
  }
}
