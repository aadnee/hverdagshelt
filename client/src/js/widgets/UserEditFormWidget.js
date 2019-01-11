import React from 'react';
import {Component} from 'react';
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

export class UserEditFormWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                                            placeholder={this.props.firstName}
                                            action
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
                                            placeholder={this.props.lastName}
                                            action
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
                                            placeholder={this.props.number}
                                            action
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
                                            placeholder={this.props.email}
                                            action
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
                                <Modal trigger={<Button fluid>Endre passord</Button>}>
                                    <Modal.Header>Endre passord</Modal.Header>
                                    <Modal.Content image>
                                        <Modal.Description>
                                            <Form>
                                                <Form.Field>
                                                    <Input fluid label='Nåværende passord:'/>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Input fluid label='Nytt passord:'/>
                                                </Form.Field>
                                                <Form.Field>
                                                    <Input fluid label='Gjenta nytt passord:'/>
                                                </Form.Field>
                                                <Button floated='right' type='submit' color='blue'>Endre passord</Button>
                                            </Form>
                                        </Modal.Description>
                                    </Modal.Content>
                                </Modal>
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