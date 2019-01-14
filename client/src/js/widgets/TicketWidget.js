import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Image, Icon, Button, Header, Placeholder, Label, Modal } from 'semantic-ui-react';
import { PENDING, DONE, REJECTED, STATUS } from '../commons';

import { PublishNewsFormWidget } from './PublishNewsFormWidget';

export class TicketWidget extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.ticket);
  }

  //STATUS:
  // PENDING = 1;
  // DONE = 3;
  // REJECTED = 4;

  render() {
    return (
      <Card centered>
        <Image>
          <Image src="img/thumbnaildiv.png" />
          {this.props.ticket.status === PENDING && !this.props.employee ? (
            <Label color="yellow" ribbon="right">
              {STATUS[PENDING - 1].norwegian}
            </Label>
          ) : null}
          {this.props.ticket.status === DONE && !this.props.employee ? (
            <Label color="green" ribbon="right">
              {STATUS[DONE - 1].norwegian}
            </Label>
          ) : null}
          {this.props.ticket.status === REJECTED && !this.props.employee ? (
            <Label color="red" ribbon="right">
              {STATUS[REJECTED - 1].norwegian}
            </Label>
          ) : null}
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
        {this.props.employee ? (
          this.props.ticket.status === PENDING ? (
            <Card.Content extra>
              <Button.Group fluid size="small">
                <Modal
                  trigger={
                    <Button inverted primary onClick={this.props.accept}>
                      Godkjenn
                    </Button>
                  }
                >
                  <Modal.Header>Registrer varselen som nyhet</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <PublishNewsFormWidget
                        headline={this.props.ticket.title}
                        details={this.props.ticket.description}
                        category={this.props.ticket.categoryId}
                      />
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
                <Button inverted secondary onClick={this.props.reject}>
                  Avslå
                </Button>
              </Button.Group>
            </Card.Content>
          ) : null
        ) : this.props.ticket.status === DONE ? (
          <Card.Content extra>
            <Button.Group fluid size="small">
              <Button inverted primary>
                Gå til nyheten
              </Button>
            </Button.Group>
          </Card.Content>
        ) : this.props.ticket.status === PENDING ? (
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
        ) : null}
      </Card>
    );
  }
}
