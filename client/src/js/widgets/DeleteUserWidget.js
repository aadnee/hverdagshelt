import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { userService } from '../services/UserServices';
import { companyServices } from '../services/CompanyServices';

export class DeleteUserWidget extends Component {
  state = { open: false };
  show = size => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });
  handle = () => {
    this.close();
    this.props.handleDelete(this.props.user.id);
  };

  render() {
    return (
      <div>
        <Button onClick={this.show('tiny')} color="red" inverted>
          Slett
        </Button>
        <Modal size="tiny" open={this.state.open} onClose={this.close}>
          <Modal.Header>Vil du slette Bruker</Modal.Header>
          <Modal.Content>
            <p>Er du sikker på at du vil slette {this.props.user.name}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.close}>
              No
            </Button>
            <Button onClick={this.handle} positive icon="checkmark" labelPosition="right" content="Yes" />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
