import React, { Component } from 'react';
import { Button, Container, Dropdown, Image, Input, Modal, Segment, Grid, Form, Icon } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { companyServices } from '../services/CompanyServices';

export class AdminRegisterWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      selectedOption: '',
      options: [],
      user: true,
      showMainModal: false,
      showRegisterModal: false,
      popupMessage: '',
      popupSuccess: ''
    };

    this.stateOptions = [
      { key: '1', value: '1', text: 'Risør' },
      { key: '2', value: '2', text: 'Lindesnes' },
      { key: '3', value: '3', text: 'Tvedestrand' },
      { key: '4', value: '4', text: 'Test 1' },
      { key: '5', value: '5', text: 'Test 2' },
      { key: '6', value: '6', text: 'Test 3' },
      { key: '7', value: '7', text: 'Test 4' }
    ];
  }

  modalChange = () => {
    this.setState({ showMainModal: false });
  };

  changeUser = user => () => this.setState({ user: user });

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    //USERSERICE -> request cookie
    console.log('submitting');
    console.log(this.state);
    this.state.user
      ? userService
          .register(
            this.state.firstname + this.state.lastname,
            this.state.email,
            this.state.phone,
            this.state.selectedOption
          )
          .then(res => {
            console.log(res);
            this.setState({ popupMessage: res.message });
            res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
            this.setState({ showRegisterModal: true });
          })
      : companyServices
          .addCompany(
            this.state.firstname + this.state.lastname,
            this.state.email,
            this.state.phone,
            this.state.selectedOption
          )
          .then(res => {
            console.log(res);
            this.setState({ popupMessage: res.message });
            res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
            this.setState({ showRegisterModal: true });
          });
  };

  closeModals = () => {
    this.setState({
      showMainModal: false,
      showRegisterModal: false
    });
  };

  render() {
    return (
      <div>
        <Modal
          onClose={this.modalChange}
          open={this.state.showMainModal}
          trigger={<Button icon="add" inverted color="green" onClick={() => this.setState({ showMainModal: true })} />}
          closeIcon
        >
          <Modal.Header>
            <h1>{this.props.user ? 'Registrer bruker' : 'Registrer bedrift'}</h1>
          </Modal.Header>
          <Modal.Content>
            <Container>
              <Grid centered divided="vertically">
                <Grid.Column mobile={16}>
                  {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
                  <Form size="large">
                    <Segment piled>
                      {this.props.user ? (
                        <div>
                          <Form.Field>
                            <label>Fornavn</label>
                            <Input
                              fluid
                              icon="user"
                              iconPosition="left"
                              placeholder="Ola"
                              type="text"
                              value={this.state.firstname}
                              onChange={(event, data) => {
                                this.handleInput('firstname', data.value);
                              }}
                            />
                          </Form.Field>
                          <Form.Field>
                            <label>Etternavn</label>
                            <Input
                              fluid
                              icon="user"
                              iconPosition="left"
                              placeholder="Nordmann"
                              type="text"
                              value={this.state.lastname}
                              onChange={(event, data) => {
                                this.handleInput('lastname', data.value);
                              }}
                            />
                          </Form.Field>
                        </div>
                      ) : (
                        <Form.Field>
                          <label>Bedriftsnavn</label>
                          <Input
                            fluid
                            icon="building"
                            iconPosition="left"
                            placeholder="Bedriftsnavn"
                            type="text"
                            value={this.state.firstname}
                            onChange={(event, data) => {
                              this.handleInput('firstname', data.value);
                            }}
                          />
                        </Form.Field>
                      )}
                      <Form.Field>
                        <label>E-postadresse</label>
                        <Input
                          fluid
                          icon="envelope"
                          iconPosition="left"
                          placeholder="E-postadresse"
                          value={this.state.email}
                          onChange={(event, data) => {
                            this.handleInput('email', data.value);
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Telefonnummer</label>
                        <Input
                          fluid
                          icon="phone"
                          iconPosition="left"
                          placeholder={'Telefonnumer'}
                          type={'number'}
                          value={this.state.phone}
                          onChange={(event, data) => {
                            this.handleInput('phone', data.value);
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Kommune</label>

                        <Dropdown
                          fluid
                          selection
                          search
                          placeholder="Velg kommune"
                          options={this.stateOptions}
                          onChange={(event, data) => {
                            this.handleInput('selectedOption', data.value);
                          }}
                        />
                      </Form.Field>
                      <Button
                        color="blue"
                        fluid
                        size="large"
                        onClick={() => {
                          this.handleSubmit();
                        }}
                      >
                        {this.props.user ? 'Registrer bruker' : 'Registrer bedrift'}
                      </Button>
                      <Button
                        color="grey"
                        fluid
                        size="large"
                        onClick={() => {
                          this.modalChange();
                        }}
                      >
                        Avbryt
                      </Button>
                    </Segment>
                  </Form>
                </Grid.Column>
              </Grid>
            </Container>
          </Modal.Content>
        </Modal>
        <Modal size={'tiny'} open={this.state.showRegisterModal}>
          <Modal.Header>Registreringsstatus: {this.state.popupSuccess ? 'Suksess' : 'Error'}</Modal.Header>
          <Modal.Content>
            <p>{this.state.popupMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button icon="check" content="Ok" onClick={this.closeModals} />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
