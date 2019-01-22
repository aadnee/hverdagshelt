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
      sentMail: true,
      loading: false
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  sentResetPassword = () => {
    this.setState({ loading: true });
    userService.sendReset(this.state.email).then(res => {
      if (res.success) {
        this.setState({ sentMail: false });
        console.log(res);
      }
    });
  };

  confirmResetPassword = () => {
    userService.resetPassword(this.state.email, this.state.password).then(res => {
      console.log(res);
    });
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
                          <Header>Gjennoprett passord</Header>
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
                          loading={this.state.loading}
                          onClick={() => {
                            this.sentResetPassword();
                          }}
                        >
                          Send email
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Form.Field>
                          <Header>Gjennoprett passord</Header>
                          <label>Skriv inn koden som ble sent til din e-mail</label>
                          <Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Midlertidig kode"
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
                            this.confirmResetPassword();
                          }}
                        >
                          Gjennoprett passord
                        </Button>
                      </div>
                    )}
                  </Segment>
                </Form>
                {this.state.sentMail ? (
                  <Message>Skriv inn din e-postadresse</Message>
                ) : (
                  <Message>Skriv inn koden du har fått på mail</Message>
                )}
              </Grid.Column>
            </Grid>
          </Container>
        )}
      </Consumer>
    );
  }
}
