import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Image, Icon, Button, Header, Placeholder, Label, Modal } from 'semantic-ui-react';
import { PENDING, DONE, REJECTED, STATUS } from '../commons';

import { PublishNewsFormWidget } from './PublishNewsFormWidget';

export class TicketWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  componentDidMount() {
    console.log(this.props.ticket);
  }

  //STATUS:
  // PENDING = 1;
  // DONE = 3;
  // REJECTED = 4;

  render() {
    const { open, size } = this.state;

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
                    <Button inverted primary>
                      Godkjenn
                    </Button>
                  }
                >
                  <Modal.Header>Registrer varselen som nyhet</Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <PublishNewsFormWidget
                        title={this.props.ticket.title}
                        description={this.props.ticket.description}
                        category={this.props.ticket.categoryId}
                        submit={this.props.accept}
                        image
                      />
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
                <Button inverted secondary onClick={this.show('mini')}>
                  Avslå
                </Button>
                <Modal size={size} open={open} onClose={this.close}>
                  <Modal.Header>Avslå innsendt varsel</Modal.Header>
                  <Modal.Content>
                    <p>Er du sikker på at du vil avlså denne varselen</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button negative onClick={this.close}>
                      Nei
                    </Button>
                    <Button positive icon="checkmark" labelPosition="right" content="Ja" onClick={this.props.reject} />
                  </Modal.Actions>
                </Modal>
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
