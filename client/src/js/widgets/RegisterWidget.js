import {
  Button,
  Container,
  Image,
  Input,
  Message,
  Segment,
  Grid,
  Form,
  Dropdown,
  Dimmer,
  Loader,
  Icon,
  Header,
  Modal
} from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { municipalService } from '../services/MunicipalServices';
import { NavLink } from 'react-router-dom';
import React from 'react';
import { Consumer } from '../context';
import { toast } from 'react-toastify';

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
      success: true,
      message: '',
      titleModal: '',
      messageModal: false
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

  handleMessage = () => {
    Consumer._currentValue.history.push('/login');
  };

  handleSubmit = () => {
    //USERSERICE -> request cookie
    if (
      this.state.firstname &&
      this.state.lastname &&
      this.state.email &&
      this.state.phone &&
      this.state.selectedOption
    ) {
      if (this.state.phone.length < 10) {
        this.setState({ success: false });
        userService
          .register(
            this.state.firstname + ' ' + this.state.lastname,
            this.state.email,
            this.state.phone,
            this.state.selectedOption
          )
          .then(res => {
            if (res.success) {
              this.setState({ success: true });

              toast.success(res.message.no);
              this.setState({
                messageModal: true,
                titleModal: 'Registering vellykket',
                message: 'Du har nå fått tilsendt passord på mail'
              });
            } else {
              this.setState({ success: false });
              toast.error(res.message.no);
            }
          });
      } else {
        toast.error('Telefonnummeret kan ikke inneholde mer enn 9 siffer');
      }
    } else {
      toast.error('Vennligst fyll inn alle felt');
    }
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
                    {!this.state.success ? <Icon size={'small'} name="circle notched" loading /> : 'Registrer deg'}
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
          <Modal open={this.state.messageModal} onClose={this.closeMessage} basic size="small" closeIcon>
            <Header icon="user" content={this.state.titleModal} />
            <Modal.Content>
              <h3>{this.state.message}</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button color="green" onClick={this.handleMessage} inverted>
                <Icon name="checkmark" /> Ok
              </Button>
            </Modal.Actions>
          </Modal>
        </Container>
      </>
    );
  }
}
