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

export class ForgotPasswordWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email ? this.props.email : '',
      password: '',
      sentMail: true
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  sentResetPassword = () => {
    this.setState({ sentMail: true });
    //userService.sendReset(this.state.email);
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
                  <Segment>
                    {this.state.sentMail ? (
                      <div>
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
                        <Button
                          color="twitter"
                          fluid
                          size="large"
                          onClick={() => {
                            this.sentResetPassword();
                          }}
                        >
                          Send mail
                        </Button>
                      </div>
                    ) : null}
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
