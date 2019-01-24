import React, { Component } from 'react';
import { Button, Container, Dropdown, Image, Input, Modal, Segment, Grid, Form, Icon } from 'semantic-ui-react';
import { municipalService } from '../services/MunicipalServices';
import { toast } from 'react-toastify';

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
      user: true
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

  changeUser = user => () => this.setState({ user: user });

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handle = () => {
    if (
      this.state.firstname &&
      (this.props.user ? this.state.lastname : true) &&
      this.state.email &&
      this.state.phone &&
      this.state.selectedOption
    ) {
      if (this.state.phone.length < 10) {
        let newUser = {
          name: this.state.firstname + ' ' + this.state.lastname,
          email: this.state.email,
          phone: this.state.phone,
          municipalId: this.state.selectedOption
        };

        console.log(newUser);
        this.props.handleRegister(newUser);
      } else {
        toast.error('Telefonnummeret kan ikke være lengre enn 9 siffer');
      }
    } else {
      toast.error('Vennligst fyll inn alle felt');
    }
  };

  render() {
    return (
      <Container>
        <Grid centered divided="vertically">
          <Grid.Column mobile={16}>
            {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
            <Form size="large">
              <Segment>
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
                    type={'email'}
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
                <Button color="grey" fluid size="large" onClick={() => this.props.close()}>
                  Avbryt
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
