import React, { Component } from 'react';
import { userService } from '../services/UserServices';
import { companyServices } from '../services/CompanyServices';
import { Button, Container, Dropdown, Image, Input, Modal, Segment, Grid, Form } from 'semantic-ui-react';
import { USER, COMPANY, EMPLOYEE, ADMIN, USERTYPE } from '../commons';
import { municipalService } from '../services/MunicipalServices';
import { toast } from 'react-toastify';

export class EditUserWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      municipalId: '',
      options: [],

      rank: null
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
    this.resetState();
  }

  resetState = () =>
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      phone: this.props.user.phone,
      municipalId: this.props.user.municipalId,
      rank: this.props.user.rank
    });

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    console.log(this.state);
  }

  handle = () => {
    if (this.state.name && this.state.email && this.state.phone && this.state.municipalId) {
      console.log(this.state.phone.length);
      if (this.state.phone.length < 10) {
        let editedUser = {
          id: this.props.user.id,
          name: this.state.name,
          email: this.state.email,
          phone: this.state.phone,
          municipalId: this.state.municipalId,
          rank: this.state.rank
        };
        this.props.handleEdit(editedUser);
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
                      value={this.state.name}
                      onChange={(event, data) => {
                        this.handleInput('name', data.value);
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
                      placeholder="Velg brukerrang"
                      value={this.state.rank}
                      options={USERTYPE}
                      onChange={(event, data) => {
                        this.handleInput('rank', data.value);
                      }}
                    />
                  </Form.Field>
                ) : null}
                <Button color="blue" fluid size="large" onClick={() => this.handle()}>
                  Lagre endringer
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
