import React, { Component } from 'react';
import { userService } from '../services/UserServices';
import { Button, Container, Dropdown, Image, Input, Modal, Segment, Grid, Form } from 'semantic-ui-react';
import { USER, COMPANY, EMPLOYEE, ADMIN, USERTYPE } from '../commons';
import { municipalServices } from '../services/MunicipalServices';

export class EditUserWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: null,
      municipalId: '',
      options: [],
      showModal: false,
      showRegisterModal: false,
      popupMessage: '',
      popupSuccess: '',
      rank: null
    };
  }

  componentWillMount() {
    municipalServices.getMunicipals().then(res => {
      let options = [];
      res.data.map(munic => {
        options.push({ key: munic.id, value: munic.id, text: munic.name });
      });
      this.setState({
        options: options
      });
    });
    console.log(this.props.user.municipalId);
    console.log(this.props.user.name);
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      phone: this.props.user.phone,
      municipalId: this.props.user.municipalId,
      rank: this.props.user.rank
    });
  }

  close = () => this.setState({ open: false });
  handleEdit = () => {
    userService
      .editUser(
        this.props.user.id,
        this.state.name,
        this.state.email,
        this.state.phone,
        this.state.municipalId,
        this.state.rank
      )
      .then(res => {
        console.log(res);
        this.setState({ popupMessage: res.message });
        res.success ? this.setState({ popupSuccess: true }) : this.setState({ popupSuccess: false });
        this.setState({ showRegisterModal: true });
      });
  };

  close = () => {
    this.setState({ showModal: false });
  };

  closeModals = () => {
    this.setState({
      showModal: false,
      showRegisterModal: false
    });
  };

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {}

  render() {
    return (
      <div>
        <Button color="green" onClick={() => this.setState({ showModal: true })}>
          Edit
        </Button>
        <Modal open={this.state.showModal}>
          <Modal.Header>Redigere Bruker</Modal.Header>
          <Container>
            <Grid centered divided="vertically">
              <Grid.Column mobile={16}>
                {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
                <Form size="large">
                  <Segment piled>
                    {this.props.userEdit ? (
                      <div>
                        <Form.Field>
                          <label>Navn</label>
                          <Input
                            fluid
                            icon="user"
                            iconPosition="left"
                            placeholder="Ola"
                            type="text"
                            value={this.state.name}
                            onChange={(event, data) => {
                              this.handleInput('name', data.value);
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
                        defaultValue={this.state.municipalId}
                        options={this.state.options}
                        onChange={(event, data) => {
                          this.handleInput('municipalId', data.value);
                        }}
                      />
                    </Form.Field>
                    {this.props.userEdit ? (
                      <Form.Field>
                        <label>Velg rang til bruker</label>

                        <Dropdown
                          fluid
                          selection
                          search
                          placeholder="Velg bruker rang"
                          value={this.state.rank}
                          options={USERTYPE}
                          onChange={(event, data) => {
                            this.handleInput('rank', data.value);
                          }}
                        />
                      </Form.Field>
                    ) : null}
                    <Button
                      color="blue"
                      fluid
                      size="large"
                      onClick={() => {
                        this.handleEdit();
                      }}
                    >
                      Registrer bruker
                    </Button>
                    <Button
                      color="grey"
                      fluid
                      size="large"
                      onClick={() => {
                        this.close();
                      }}
                    >
                      Avbryt
                    </Button>
                  </Segment>
                </Form>
              </Grid.Column>
            </Grid>
          </Container>
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
