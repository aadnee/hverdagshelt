import React from 'react';
import {Component} from 'react';
import {toast} from 'react-toastify';
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
    Popup
} from 'semantic-ui-react';
import {userService} from '../services/UserServices';
import {municipalService} from '../services/MunicipalServices';

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
            followedMunicipals: []
        }
    };

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
        return userService.getMunicipals()
            .then(res => {
                return res.data.map((mun) => {
                    return {key: mun.id, value: mun.name, text: mun.name}
                })
            })
            .then(opt => {
                    this.setState({followedMunicipals: opt});
                    return opt;
                }
            );
    }

    handleEdit(key) {
        this.setState({[key]: !this.state[key]});
    };

    handleInput = (key, value) => {
        this.setState({[key]: value});
    };

    addMunicipals = (index) => {
        let muns = this.state.municipalOptions;//deletes chosen municipal from "all municipals"
        let deletedMun = muns.splice(index, 1);
        this.setState({municipalOptions: muns});
        userService.addMunicipal(deletedMun[0].key);


        this.setState({followedMunicipals: this.state.followedMunicipals.concat(deletedMun)});//adds the deleted municipal back to the list of followed municipals
    };

    deleteMunicipals = (index) => {
        let followedMuns = this.state.followedMunicipals;//deletes chosen municipal from "followed municipals"
        let deletedMun = followedMuns.splice(index, 1);
        this.setState({followedMunicipals: followedMuns});
        userService.deleteMunicipal(deletedMun[0].key);

        this.setState({municipalOptions: this.state.municipalOptions.concat(deletedMun)});//adds the deleted municipal back to the list of all municipals
    };

    submit = () => {
        console.log(this.state);
        if (this.state.oldPassword === null && this.state.newPassword === null && this.state.repeatedPassword === null) {
            userService
                .editMe(this.state.firstName, this.state.lastName, this.state.email, this.state.phone, this.state.municipalId, null, null)
                .then(res => console.log(res),
                    toast.success('Bruker oppdatert!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    }));
        } else if (this.state.oldPassword != null && this.state.newPassword != this.state.repeatedPassword) {
            toast.error('Passordene stemmer ikke overens. Prøv igjen.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else if (this.state.oldPassword != null && this.state.newPassword === this.state.repeatedPassword) {
            userService
                .editMe(this.state.firstName, this.state.lastName, this.state.email, this.state.phone, this.state.municipalId, this.state.oldPassword, this.state.newPassword)
                .then(res => {
                    if (res.success) {
                        console.log(res.success),
                            toast.success('Bruker oppdatert!', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            })
                    } else {
                        toast.error(res.message.no, {
                            position: "top-right",
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

<<<<<<< HEAD
  render() {
    return (
      <Container>
        <Grid.Column>
          <Form size="large">
            <Segment basic color="blue">
              <p>Her har vi litt informasjon om Brukeren</p>
              <Divider horizontal>
                <Icon name="user" />
              </Divider>
              <Divider hidden />
              <Form.Field>
                <Grid columns={'equal'}>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      id="form-subcomponent-shorthand-input-first-name"
                      label="Fornavn"
                      placeholder="Fornavn"
                      action
                      value={this.state.firstName}
                      onChange={(event, data) => {
                        this.handleInput('firstName', data.value);
                      }}
                    >
                      <input disabled={!this.state.editFirstname} />
                      <Popup
                        trigger={
                          <Button
                            icon={'edit'}
                            color={'blue'}
                            onClick={() => {
                              this.handleEdit('editFirstname');
                            }}
                          />
                        }
                      >
                        Endre fornavn
                      </Popup>
                    </Form.Input>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      fluid
                      id="form-subcomponent-shorthand-input-last-name"
                      label="Etternavn"
                      placeholder="Etternavn"
                      action
                      value={this.state.lastName}
                      onChange={(event, data) => {
                        this.handleInput('lastName', data.value);
                      }}
                    >
                      <input disabled={!this.state.editLastname} />
                      <Popup
                        trigger={
                          <Button
                            icon={'edit'}
                            color={'blue'}
                            onClick={() => {
                              this.handleEdit('editLastname');
                            }}
                            toggle
                          />
                        }
                      >
                        Endre etternavn
                      </Popup>
                    </Form.Input>
                  </Grid.Column>
                </Grid>
              </Form.Field>
              <Form.Field>
                <Grid columns={'equal'}>
                  <Grid.Column>
                    <Form.Input
                      label="Telefonnummer"
                      iconPosition="left"
                      placeholder="Telefonnummer"
                      action
                      value={this.state.phone}
                      onChange={(event, data) => {
                        this.handleInput('phone', data.value);
                      }}
                    >
                      <Icon name="phone" color="blue" />
                      <input disabled={!this.state.editPhonenumber} />
                      <Popup
                        trigger={
                          <Button
                            icon={'edit'}
                            color={'blue'}
                            onClick={() => {
                              this.handleEdit('editPhonenumber');
                            }}
                            toggle
                          />
                        }
                      >
                        Endre telefonnummer
                      </Popup>
                    </Form.Input>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      label="E-mail"
                      iconPosition="left"
                      placeholder="E-mail"
                      action
                      value={this.state.email}
                      onChange={(event, data) => {
                        this.handleInput('email', data.value);
                      }}
                    >
                      <Icon name="mail" color="blue" />
                      <input disabled={!this.state.editEmail} />
                      <Popup
                        trigger={
                          <Button
                            icon={'edit'}
                            color={'blue'}
                            onClick={() => {
                              this.handleEdit('editEmail');
                            }}
                            toggle
                          />
                        }
                      >
                        Endre email
                      </Popup>
                    </Form.Input>
                  </Grid.Column>
                </Grid>
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
                  placeholder="Kommune"
                  search
                  selection
                  options={this.state.municipalOptions}
                  onChange={(event, data) => {
                    this.addMunicipals(data.options.map(e => e.value).indexOf(data.value));
                    this.setState({ selectedMunicipal: true });
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
=======
    render() {
        return (
            <Container>
                <Grid.Column>
                    <Form size='large'>
                        <Segment stacked color='blue'>
                            <Header as='h1'>Din profil</Header>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider horizontal><Icon name='user'/></Divider>
                            <Divider hidden/>
                            <Form.Field>
                                <Grid stackable columns={'equal'}>
                                    <Grid.Column>
                                        <Form.Input
                                            fluid
                                            id='form-subcomponent-shorthand-input-first-name'
                                            label='Fornavn'
                                            placeholder='Fornavn'
                                            action
                                            value={this.state.firstName}
                                            onChange={(event, data) => {
                                                this.handleInput('firstName', data.value);
                                            }
                                            }>
                                            <input disabled={!this.state.editFirstname}/>
                                            <Popup trigger={
                                                <Button
                                                    icon={"edit"}
                                                    color={"blue"}
                                                    onClick={() => {
                                                        this.handleEdit('editFirstname')
                                                    }}/>
                                            }>Endre fornavn
                                            </Popup>
                                        </Form.Input>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input
                                            fluid
                                            id='form-subcomponent-shorthand-input-last-name'
                                            label='Etternavn'
                                            placeholder='Etternavn'
                                            action
                                            value={this.state.lastName}
                                            onChange={(event, data) => {
                                                this.handleInput('lastName', data.value);
                                            }}
                                        >
                                            <input disabled={!this.state.editLastname}/>
                                            <Popup trigger={
                                                <Button
                                                    icon={"edit"}
                                                    color={"blue"}
                                                    onClick={() => {
                                                        this.handleEdit('editLastname')
                                                    }}
                                                    toggle/>
                                            }>Endre etternavn
                                            </Popup>
                                        </Form.Input>
                                    </Grid.Column>
                                </Grid>
                            </Form.Field>
                            <Form.Field>
                                <Grid stackable columns={'equal'}>
                                    <Grid.Column>
                                        <Form.Input
                                            fluid
                                            label='Telefonnummer'
                                            iconPosition='left'
                                            placeholder='Telefonnummer'
                                            action
                                            value={this.state.phone}
                                            onChange={(event, data) => {
                                                this.handleInput('phone', data.value);
                                            }}
                                        >
                                            <Icon name='phone' color='blue'/>
                                            <input disabled={!this.state.editPhonenumber}/>
                                            <Popup trigger={
                                                <Button icon={"edit"}
                                                        color={"blue"}
                                                        onClick={() => {
                                                            this.handleEdit('editPhonenumber')
                                                        }}
                                                        toggle/>
                                            }>Endre telefonnummer
                                            </Popup>
                                        </Form.Input>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input
                                            fluid
                                            label='E-mail'
                                            iconPosition='left'
                                            placeholder='E-mail'
                                            action
                                            value={this.state.email}
                                            onChange={(event, data) => {
                                                this.handleInput('email', data.value);
                                            }}
                                        >
                                            <Icon name='mail' color='blue'/>
                                            <input disabled={!this.state.editEmail}/>
                                            <Popup trigger={
                                                <Button icon={"edit"}
                                                        color={"blue"}
                                                        onClick={() => {
                                                            this.handleEdit('editEmail')
                                                        }}
                                                        toggle/>
                                            }>Endre email
                                            </Popup>
                                        </Form.Input>
                                    </Grid.Column>
                                </Grid>
                            </Form.Field>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider horizontal><Icon name='map signs'/></Divider>
                            <Divider hidden/>
                            <Form.Field>
                                <label>Kommuner jeg følger med på:</label>
                                <div>
                                    {this.state.followedMunicipals.map((mun, i) => (
                                        <Label size='large' color='blue' as='a' key={mun.value}>
                                            {mun.text}
                                            <Icon name='delete' onClick={() => this.deleteMunicipals(i)}/>
                                        </Label>
                                    ))}
                                </div>
                                <br/>
                                <label>Legg til flere kommuner:</label>
                                <Dropdown
                                    placeholder='Kommune'
                                    search
                                    selection
                                    options={this.state.municipalOptions}
                                    onChange={(event, data) => {
                                        this.addMunicipals(data.options.map((e) => e.value).indexOf(data.value));
                                        this.setState({selectedMunicipal: true});
                                    }}
                                />
                            </Form.Field>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider hidden/>
                            <Divider horizontal><Icon name='key'/></Divider>
                            <Divider hidden/>
>>>>>>> a529c7d1b641a2f42ec79af13355790306a764b2

                            <Form.Field>
                                <label>Endre passord?</label>
                                <Divider hidden/>
                                <Form.Field>
                                    <Input
                                        fluid
                                        type='password'
                                        label={{size: 'small', content: 'Nåværende passord:'}}
                                        onChange={(event, data) => {
                                            this.handleInput('oldPassword', data.value);
                                        }}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Input
                                        fluid
                                        type='password'
                                        label={{size: 'small', content: 'Nytt passord:'}}
                                        onChange={(event, data) => {
                                            this.handleInput('newPassword', data.value);
                                        }}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Input
                                        fluid
                                        type='password'
                                        label={{size: 'small', content: 'Gjenta nytt passord:'}}
                                        onChange={(event, data) => {
                                            this.handleInput('repeatedPassword', data.value);
                                        }}
                                    />
                                </Form.Field>
                            </Form.Field>
                            <Button
                                color="blue"
                                fluid
                                size="large"
                                onClick={() => {
                                    this.submit();
                                }}>
                                Lagre endringer
                            </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Container>
        );
    }
}