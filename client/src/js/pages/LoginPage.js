import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Image, Segment, Form, Message, Button, Input } from 'semantic-ui-react';

//import {} from './../widgets';

export class LoginPage extends Component {
  render() {
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Image src="img/vector-logo-lav-farge.png" />
            <Form size="large">
              <Segment piled>
                <Form.Field>
                  <label>E-postadresse</label>
                  <Input fluid icon="user" iconPosition="left" placeholder="E-postadresse" />
                </Form.Field>
                <Form.Field>
                  <label>Passord</label>
                  <Input fluid icon="lock" iconPosition="left" placeholder="Passord" type="password" />
                </Form.Field>

                <Button color="blue" fluid size="large">
                  Logg inn
                </Button>
              </Segment>
            </Form>
            <Message>
              Har du ikke bruker? <NavLink to="/register">Registrer deg</NavLink>
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
