import { Button, Container, Image, Input, Message, Segment, Grid, Form, Dropdown, Modal } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { municipalService } from '../services/MunicipalServices';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Consumer } from '../context';

export class RegisterWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      selectedOption: '',
      options: [],
      showModal: false,
      showRegisterModal: false,
      popupMessage: '',
      popupSuccess: ''
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

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    //USERSERICE -> request cookie
    console.log('submitting');
    userService
      .register(
        this.state.firstname + ' ' + this.state.lastname,
        this.state.email,
        this.state.phone,
        this.state.selectedOption
      )
      .then(res => {
        this.setState({
          popupMessage: res.message.no,
          popupSuccess: res.success,
          showRegisterModal: true
        });
        console.log(res);
      });
  };

  handleComplete = () => {
    this.setState({ showRegisterModal: false });
    this.state.popupSuccess ? Consumer._currentValue.history.push({ pathname: '/login' }) : null;
  };

  render() {
    return (
      <>
        <Container>
          <Grid centered divided="vertically">
            <Grid.Column mobile={16}>
              {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
              <Form size="large">
                <Segment>
                  <Form.Field>
                    <label>Fornavn</label>
                    <Input
                      fluid
                      icon="user"
                      iconPosition="left"
                      placeholder="Ola/Kari"
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
                      placeholder={'Ditt telefonnumer'}
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
                  <Button
                    color="blue"
                    fluid
                    size="large"
                    onClick={() => {
                      this.handleSubmit();
                    }}
                  >
                    Registrer deg
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </Container>
        <Modal size={'tiny'} open={this.state.showRegisterModal}>
          <Modal.Header>Registreringsstatus: {this.state.popupSuccess ? 'Suksess' : 'Error'}</Modal.Header>
          <Modal.Content>
            <p>{this.state.popupMessage}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button icon="check" content="Ok" onClick={this.handleComplete} />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}
