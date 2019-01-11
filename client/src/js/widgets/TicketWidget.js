import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Image, Icon, Button, Header, Placeholder, Label } from 'semantic-ui-react';

//import {} from './';

/**
 * Options:
 * logo (boolean) - Adds a logo on top of the login Segment
 * register (boolean) - Displays a message underneath with link to the register page
 */

export class TicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  //STATUS:
  //
  //
  //
  render() {
    return (
      <Card centered>
        <Image>
          <Image src="img/thumbnaildiv.png" />
          <Label color="yellow" ribbon="right">
            Under behandling
          </Label>
        </Image>
        <Card.Content>
          <Header>
            <Header.Content>
              {this.props.ticket.title}
              <Header.Subheader>{this.props.ticket.category}</Header.Subheader>
              {this.props.ticket.subCategory ? (
                <Header.Subheader>{this.props.ticket.subCategory}</Header.Subheader>
              ) : null}
            </Header.Content>
          </Header>
          <Card.Meta>{this.props.ticket.createdAt}</Card.Meta>
          <Card.Description>{this.props.ticket.description}</Card.Description>
        </Card.Content>
        {this.props.admin ? (
          !this.props.published ? (
            <Card.Content extra>
              <Button.Group fluid size="small">
                <Button inverted primary>
                  Godkjenn
                </Button>
                <Button inverted secondary>
                  Avslå
                </Button>
              </Button.Group>
            </Card.Content>
          ) : null
        ) : this.props.published ? (
          <Card.Content extra>
            <Button.Group fluid size="small">
              <Button inverted primary>
                Gå til nyheten
              </Button>
            </Button.Group>
          </Card.Content>
        ) : (
          <Card.Content extra>
            <Button.Group fluid size="small">
              <Button inverted primary>
                Endre
              </Button>
              <Button inverted secondary>
                Trekk tilbake
              </Button>
            </Button.Group>
          </Card.Content>
        )}
      </Card>
    );
  }
}
