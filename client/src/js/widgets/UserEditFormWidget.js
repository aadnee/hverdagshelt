import React from 'react';
import { Component } from 'react';
import { toast } from 'react-toastify';
import {
  Dropdown,
  Icon,
  Label,
  Input,
  Form,
  Divider,
  Segment,
  Container,
  Grid,
  List,
  Header,
  Image,
  Button,
  Modal,
  Popup,
  Checkbox
} from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { municipalService } from '../services/MunicipalServices';
import { Consumer } from './../context';

export class UserEditFormWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      phone: this.props.user.phone,
      municipalId: this.props.user.municipalId,
      newPassword: null,
      oldPassword: null,
      repeatedPassword: null,
      editFirstname: false,
      editLastname: false,
      editPhonenumber: false,
      editEmail: false,
      editPassword: false,
      municipal: '',
      municipalOptions: [],
      followedMunicipals: [],
      notifications: this.props.user.notifications
    };
  }

  componentWillMount() {
    let prom = this.getFollowedMunicipals();
    console.log(prom);
    Promise.all([prom]).then(() => {
      this.getMunicipalOptions();
    });
  }

  getMunicipalOptions() {
    municipalService
      .getMunicipals()
      .then(res => {
        return res.data
          .filter(mun => !this.state.followedMunicipals.find(f => f.key === mun.id))
          .map(mun => {
            return { key: mun.id, value: mun.name, text: mun.name };
          });
      })
      .then(opt => {
        console.log(opt);
        this.setState({ municipalOptions: opt });
        setTimeout(() => console.log(this.state.municipalOptions), 10);
        return opt;
      });
  }

  getFollowedMunicipals() {
    return userService
      .getMunicipals()
      .then(res => {
        return res.data.map(mun => {
          return { key: mun.id, value: mun.name, text: mun.name };
        });
      })
      .then(opt => {
        this.setState({ followedMunicipals: opt });
        return opt;
      });
  }

  handleEdit(key) {
    this.setState({ [key]: !this.state[key] });
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleNotifications = state => {
    if (state === false) this.setState({ notifications: true });
    else this.setState({ notifications: false });
  };

  addMunicipals = index => {
    let muns = this.state.municipalOptions; //deletes chosen municipal from "all municipals"
    let deletedMun = muns.splice(index, 1);
    this.setState({ municipalOptions: muns });
    userService.addMunicipal(deletedMun[0].key);

    this.setState({ followedMunicipals: this.state.followedMunicipals.concat(deletedMun) }); //adds the deleted municipal back to the list of followed municipals
  };

  deleteMunicipals = index => {
    let followedMuns = this.state.followedMunicipals; //deletes chosen municipal from "followed municipals"
    let deletedMun = followedMuns.splice(index, 1);
    this.setState({ followedMunicipals: followedMuns });
    userService.deleteMunicipal(deletedMun[0].key);

    this.setState({ municipalOptions: this.state.municipalOptions.concat(deletedMun) }); //adds the deleted municipal back to the list of all municipals
  };

  submit = () => {
    if (this.state.oldPassword === null && this.state.newPassword === null && this.state.repeatedPassword === null) {
      userService
        .editMe(
          this.state.firstName,
          this.state.lastName,
          this.state.email,
          this.state.phone,
          this.state.municipalId,
          null,
          null,
          this.state.notifications
        )
        .then(
          res => console.log(res),
          toast.success('Bruker oppdatert!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        );
    } else if (this.state.oldPassword != null && this.state.newPassword != this.state.repeatedPassword) {
      toast.error('Passordene stemmer ikke overens. Prøv igjen.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else if (this.state.oldPassword != null && this.state.newPassword === this.state.repeatedPassword) {
      userService
        .editMe(
          this.state.firstName,
          this.state.lastName,
          this.state.email,
          this.state.phone,
          this.state.municipalId,
          this.state.oldPassword,
          this.state.newPassword,
          this.state.notifications
        )
        .then(res => {
          if (res.success) {
            console.log(res.success),
              toast.success('Bruker oppdatert!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
              });
          } else {
            toast.error(res.message.no, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          }
        });
    }
  };

  render() {
    //console.log(Consumer._currentValue.user);
    return (
      <Container>
        <Grid.Column>
          <Form size="large">
            <Segment stacked color="blue" basic>
              <p>Litt informasjon om brukeren</p>
              <Divider hidden />

              <Divider horizontal>
                <Icon name="user" />
              </Divider>
              <Divider hidden />
              <Form.Field>
                <Grid stackable columns={'equal'}>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      label="Fornavn"
                      placeholder="Fornavn"
                      value={this.state.firstName}
                      onChange={(event, data) => {
                        this.handleInput('firstName', data.value);
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      label="Etternavn"
                      placeholder="Etternavn"
                      value={this.state.lastName}
                      onChange={(event, data) => {
                        this.handleInput('lastName', data.value);
                      }}
                    />
                  </Grid.Column>
                </Grid>
              </Form.Field>
              <Form.Field>
                <Grid stackable columns={'equal'}>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      label="Telefonnummer"
                      icon="phone"
                      iconPosition="left"
                      placeholder="Telefonnummer"
                      value={this.state.phone}
                      onChange={(event, data) => {
                        this.handleInput('phone', data.value);
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      label="E-mail"
                      iconPosition="left"
                      icon="mail"
                      placeholder="E-mail"
                      value={this.state.email}
                      onChange={(event, data) => {
                        this.handleInput('email', data.value);
                      }}
                    />
                  </Grid.Column>
                </Grid>
                <Divider hidden />
                <Divider hidden />
                <Checkbox
                  label="Jeg ønsker varsler på mail"
                  checked={this.state.notifications}
                  onChange={() => {
                    this.handleNotifications(this.state.notifications);
                  }}
                />
              </Form.Field>
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              <Divider horizontal>
                <Icon name="map signs" />
              </Divider>
              <Divider hidden />
              <Form.Field>
                <label>Kommuner jeg følger med på:</label>
                <div>
                  {this.state.followedMunicipals.map((mun, i) => (
                    <Label size="large" color="blue" as="a" key={mun.value}>
                      {mun.text}
                      <Icon name="delete" onClick={() => this.deleteMunicipals(i)} />
                    </Label>
                  ))}
                </div>
                <br />
                <label>Legg til flere kommuner:</label>
                <Dropdown
                  placeholder="Velg kommune"
                  text="Velg kommune"
                  search
                  selection
                  options={this.state.municipalOptions}
                  onChange={(event, data) => {
                    if ((event.type !== 'keydown' && event.type !== 'blur') || event.key === 'Enter') {
                      let index = data.options.map(e => e.value).indexOf(data.value);
                      this.addMunicipals(index);
                    }
                    //this.setState({ selectedMunicipal: true });
                  }}
                />
              </Form.Field>
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              <Divider hidden />
              <Divider horizontal>
                <Icon name="key" />
              </Divider>
              <Divider hidden />

              <Form.Field>
                <label>Endre passord?</label>
                <Form.Field>
                  <Input
                    fluid
                    iconPosition="left"
                    placeholder="Nåværende passord"
                    type="password"
                    onChange={(event, data) => {
                      this.handleInput('oldPassword', data.value);
                    }}
                  >
                    <Icon name="key" />
                    <input />
                  </Input>
                </Form.Field>
                <Form.Field>
                  <Input
                    fluid
                    iconPosition="left"
                    placeholder="Nytt passord"
                    type="password"
                    onChange={(event, data) => {
                      this.handleInput('newPassword', data.value);
                    }}
                  >
                    <Icon name="key" />
                    <input />
                  </Input>
                </Form.Field>
                <Form.Field>
                  <Input
                    fluid
                    iconPosition="left"
                    placeholder="Gjenta nytt passord"
                    type="password"
                    onChange={(event, data) => {
                      this.handleInput('repeatedPassword', data.value);
                    }}
                  >
                    <Icon name="key" />
                    <input />
                  </Input>
                </Form.Field>
              </Form.Field>
              <Button
                color="blue"
                fluid
                size="large"
                onClick={() => {
                  this.submit();
                }}
              >
                Lagre endringer
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Container>
    );
  }
}
