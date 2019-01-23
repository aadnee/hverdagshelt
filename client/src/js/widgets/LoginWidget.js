import React from 'react';
import { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Container, Grid, Header, Image, Segment, Form, Message, Button, Input } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { Consumer } from '../context';

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
      email: this.props.email ? this.props.email : '',
      password: ''
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <Consumer>
        {({ login }) => (
          <Container>
            <Grid centered>
              <Grid.Column mobile={16}>
                {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
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
                      <label>
                        <NavLink to="/forgotpassword">Glemt passord?</NavLink>
                      </label>
                    </Form.Field>

                    <Button
                      color="twitter"
                      fluid
                      size="large"
                      onClick={() => {
                        console.log('click');
                        login(this.state.email, this.state.password);
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
        )}
      </Consumer>
    );
  }
}
