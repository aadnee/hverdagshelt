import React from 'react';
import { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Container, Grid, Header, Image, Segment, Form, Message, Button, Input, Modal, Icon } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { Consumer } from '../context';
import { MessageWidget } from './MessageWidget';
import { toast } from 'react-toastify';

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
      loading: false,
      messageModal: false,
      titleModal: '',
      message: ''
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
      } else {
        toast.error(res.message.no);
        this.setState({ loading: false });
      }
    });
  };

  handleMessage = () => {
    Consumer._currentValue.history.push('/login');
  };

  closeMessage = () => {
    this.setState({ messageModal: false });
  };

  confirmResetPassword = () => {
    userService.resetPassword(this.state.email, this.state.password).then(res => {
      if (res.success) {
        this.setState({
          messageModal: true,
          titleModal: 'Gjennopretting av passord',
          message: 'Du har nå fått tilsendt nytt passord på mail'
        });
      } else {
        toast.error('Feil kode');
      }
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
                          <Header>Tilbakestill passord</Header>
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
                          Tilbakestill
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
            <Modal open={this.state.messageModal} onClose={this.closeMessage} closeIcon basic size="small">
              <Header icon="user" content={this.state.titleModal} />
              <Modal.Content>
                <h3>{this.state.message}</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button color="blue" onClick={this.handleMessage} inverted>
                  <Icon name="checkmark" /> Ok
                </Button>
              </Modal.Actions>
            </Modal>
          </Container>
        )}
      </Consumer>
    );
  }
}
