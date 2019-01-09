import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Grid, Header, Image, Segment, Form, Message, Button } from 'semantic-ui-react';

//import {} from './../widgets';

export class LoginPage extends Component {
  render() {
    return (
      <Container>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Image src="img/vector-logo-lav-farge.png" />
            <Form size="large">
              <Segment stacked>
                <Form.Input fluid icon="user" iconPosition="left" placeholder="E-postadresse" />
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Passord" type="password" />

                <Button color="blue" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <a href="#">Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
