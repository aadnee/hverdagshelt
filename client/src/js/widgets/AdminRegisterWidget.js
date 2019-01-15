import React, { Component } from 'react';
import { Button, Container, Dropdown, Image, Input, Modal, Segment, Grid, Form, Icon } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { companyService } from '../services/CompanyServices';
import { municipalService } from '../services/MunicipalServices';

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
      showMainModal: false
    };
  }

  componentWillMount() {
    municipalService.getMunicipals().then(res => {
      let options = [];
      res.data.map(munic => {
        options.push({ key: munic.id, value: munic.id, text: munic.name });
      });
      this.setState({
        options: options
      });
    });
  }

  modalChange = () => {
    this.setState({ showMainModal: false });
  };

  changeUser = user => () => this.setState({ user: user });

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  closeModals = () => {
    this.setState({
      showRegisterModal: false
    });
  };

  handle = () => {
    let newUser = {
      name: this.state.firstname + this.state.lastname,
      email: this.state.email,
      phone: this.state.phone,
      municipalId: this.state.selectedOption
    };
    console.log(newUser);
    this.setState({ showMainModal: this.props.handleRegister(newUser) });
    this.closeModals();
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
                          options={this.state.options}
                          onChange={(event, data) => {
                            this.handleInput('selectedOption', data.value);
                          }}
                        />
                      </Form.Field>
                      <Button color="blue" fluid size="large" onClick={() => this.handle()}>
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
      </div>
    );
  }
}
