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
    Modal
} from 'semantic-ui-react';
import {userService} from "../services/UserServices";

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
            municipalOptions:
                [
                    {key: 'Osl', value: 'Oslo', text: 'Oslo'},
                    {key: 'Vns', value: 'Vennesla', text: 'Vennesla'},
                    {key: 'Krs', value: 'Kristiansand', text: 'Kristiansand'}
                ],
            followedMunicipals:
                [
                    {key: 'Trd', value: 'Trondheim', text: 'Trondheim'}
                ]
        }
    };

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

        this.setState({followedMunicipals: this.state.followedMunicipals.concat(deletedMun)});//adds the deleted municipal back to the list of followed municipals

    };

    deleteMunicipals = (index) => {
        let followedMuns = this.state.followedMunicipals;//deletes chosen municipal from "followed municipals"
        let deletedMun = followedMuns.splice(index, 1);
        this.setState({followedMunicipals: followedMuns});

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
                        toast.error(res => res.success.message, {
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
                                <Grid columns={'equal'}>
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
                                            }}
                                        >
                                            <input disabled={!this.state.editFirstname}/>
                                            <Button icon={"edit"} color={"blue"} onClick={() => {
                                                this.handleEdit('editFirstname')
                                            }} toggle/>
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
                                            <Button icon={"edit"} color={"blue"} onClick={() => {
                                                this.handleEdit('editLastname')
                                            }} toggle/>
                                        </Form.Input>
                                    </Grid.Column>
                                </Grid>
                            </Form.Field>
                            <Form.Field>
                                <Grid columns={'equal'}>
                                    <Grid.Column>
                                        <Form.Input
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
                                            <Button icon={"edit"} color={"blue"} onClick={() => {
                                                this.handleEdit('editPhonenumber')
                                            }} toggle/>
                                        </Form.Input>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input
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
                                            <Button icon={"edit"} color={"blue"} onClick={() => {
                                                this.handleEdit('editEmail')
                                            }} toggle/>
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
                                        <Label as='a' key={mun.value}>
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