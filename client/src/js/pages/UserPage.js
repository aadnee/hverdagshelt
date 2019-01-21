import React from 'react';
import { Component } from 'react';
import { userService } from '../services/UserServices';
import { UserEditFormWidget, ShortCutWidget } from './../widgets/UserEditFormWidget';
import { Container, Grid, Header, Divider, Sticky, Rail } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

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
          <Grid centered>
            <Grid.Column width={11}>
              <Header as="h1">Min side</Header>
              <UserEditFormWidget user={this.state.user} />
              <Rail position="right" fluid className="hideOnPhone">
                <Divider hidden />
                <Divider hidden />
                <Divider hidden />
                <NavLink to={'/tickets'}>Mine varslinger</NavLink>
                <Divider hidden />
                <NavLink to={'/subscriptions'}>Nyheter jeg følger</NavLink>
                <Divider hidden />
                <NavLink to={'/logout'}>Logg av</NavLink>
              </Rail>
            </Grid.Column>
          </Grid>
        </Container>
      );
    } else {
      return null;
    }
  }
}
