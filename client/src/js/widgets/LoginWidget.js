import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Image, Segment, Form, Message, Button, Input } from 'semantic-ui-react';
import { userService } from '../services/UserServices';

//import {} from './';

/**
 * Options:
 * logo (boolean) - Adds a logo on top of the login Segment
 * register (boolean) - Displays a message underneath with link to the register page
 */

export class LoginWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    //USERSERICE -> request cookie
    console.log('submitting');
    console.log(this.state);
    userService.login(this.state.email, this.state.password).then(res => console.log(res));
  };

  render() {
    return (
      <Container>
        <Grid centered>
          <Grid.Column mobile={16}>
            {this.props.logo ? (
              <NavLink to={'/'}>
                <Image src="img/vector-logo-lav-farge.png" />{' '}
              </NavLink>
            ) : null}
            <Form size="large">
              <Segment piled>
                <Form.Field>
                  <label>E-postadresse</label>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-postadresse"
                    value={this.state.email}
                    onChange={(event, data) => {
                      this.handleInput('email', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Passord</label>
                  <Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Passord"
                    type="password"
                    value={this.state.password}
                    onChange={(event, data) => {
                      this.handleInput('password', data.value);
                    }}
                  />
                </Form.Field>

                <Button
                  color="twitter"
                  fluid
                  size="large"
                  onClick={() => {
                    this.handleSubmit();
                  }}
                >
                  Logg inn
                </Button>
              </Segment>
            </Form>
            {this.props.register ? (
              <Message>
                Har du ikke bruker? <NavLink to="/register">Registrer deg</NavLink>
              </Message>
            ) : null}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
