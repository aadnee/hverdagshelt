import { Button, Container, Image, Input, Message, Segment, Grid, Form, Dropdown } from 'semantic-ui-react';

import { NavLink } from 'react-router-dom';
import React from 'react';

export class RegisterWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: '',
      surname: '',
      email: '',
      number: '',
      selectedOption: '',

      options: []
    };

    this.stateOptions = [
      { key: '1', value: '1', text: 'Risør' },
      { key: '2', value: '2', text: 'Lindesnes' },
      { key: '3', value: '3', text: 'Tvedestrand' },
      { key: '4', value: '4', text: 'Test 1' },
      { key: '5', value: '5', text: 'Test 2' },
      { key: '6', value: '6', text: 'Test 3' },
      { key: '7', value: '7', text: 'Test 4' }
    ];
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    //USERSERICE -> request cookie
    console.log('submitting');
    console.log(this.state);
  };
  /*
  componentWillMount() {
    let stateOptions = [
      { key: '1', value: 'risor', text: 'Risør' },
      { key: '2', value: 'lindesnes', text: 'Lindesnes' },
      { key: '3', value: 'tved', text: 'Tvedestrand' },
      { key: '4', value: 'kom1', text: 'Test 1' },
      { key: '5', value: 'kom2', text: 'Test 2' },
      { key: '6', value: 'kom3', text: 'Test 3' },
      { key: '7', value: 'kom4', text: 'Test 4' }
    ];
    this.setState({ options: stateOptions });
  }*/

  render() {
    return (
      <Container>
        <h1>Registrer deg</h1>
        <Grid centered>
          <Grid.Column mobile={16}>
            {this.props.logo ? <Image src="img/vector-logo-lav-farge.png" /> : null}
            <Form size="large">
              <Segment piled>
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
                    value={this.state.surname}
                    onChange={(event, data) => {
                      this.handleInput('surname', data.value);
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
                    value={this.state.number}
                    onChange={(event, data) => {
                      this.handleInput('number', data.value);
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
                    options={this.stateOptions}
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
                  Logg inn
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
